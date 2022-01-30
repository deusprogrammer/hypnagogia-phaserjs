import { Player, Cat, Mouse, Monster, RemoteControlledSprite, PlayerControlledSprite, AbstractSprite } from '../objects/sprites';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { AbstractPausableScene } from './abstractPausableScene';
import Level from '../objects/level';
import levels from '../data/levels';
import config from '../config';

const WS_ADDRESS = 'wss:/deusprogrammer.com/ws/hypnagogia';

let urlParams: URLSearchParams = new URLSearchParams(window.location.search);
let sessionId: string = urlParams.get('sessionId') || '';

type WSEvent = {
    type: "UPDATE" | "CONNECT" | "READY",
    sessionId: string,
    player: "day" | "night",
    playerData: {
        x: number,
        y: number,
        direction: "UP" | "DOWN" | "LEFT" | "RIGHT",
        velocity: {
            x: number,
            y: number
        },
        currentAnimation: string,
        state: "ALIVE" | "DEAD"
    }
}

export default class CycleScene extends AbstractPausableScene {
    player: PlayerControlledSprite;
    remote: RemoteControlledSprite;
    level: Level;
    ws: WebSocket;
    state: string;
    cycle: string;
    levelId: string;
    music: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: 'CycleScene' });
        this.state = 'WAITING';
        this.levelId = 'level1';
    }

    onPlayerMove(player: PlayerControlledSprite, ws: WebSocket) {
        let { direction, x, y, body: {velocity: {x: velocityX, y: velocityY}} } = player;
        ws.send(JSON.stringify({
            type: 'UPDATE',
            sessionId,
            player: this.cycle,
            playerData: {
                direction,
                x,
                y,
                velocity: {
                    x: velocityX,
                    y: velocityY
                },
                currentAnimation: player.anims.currentAnim.key
            }
        }));
    }

    onRemoteMove({ playerData: { x, y, direction, currentAnimation, velocity } }: WSEvent) {
        this.remote.x = x;
        this.remote.y = y;
        this.remote.direction = direction;
        this.remote.play(currentAnimation, true);
    }

    init({ cycle }) {
        this.cycle = cycle;
    }

    create() {
        let text : Phaser.GameObjects.Text;
        if (this.cycle === 'day') {
            this.cameras.main.setBackgroundColor('#FFFFFF');
            text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "Waking Up...", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
            text.setOrigin(0.5, 0.5);
        } else if (this.cycle === 'night') {
            this.cameras.main.setBackgroundColor('#000000');
            text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "Falling Asleep...Sweet Dreams", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
            text.setOrigin(0.5, 0.5);
        }

        let ws : WebSocket;
        try {
            let interval;
            ws = this.ws = new W3CWebSocket(WS_ADDRESS);
            this.ws.onopen = () => {
                console.log('CONNECTED TO WEBSOCKET');
                this.ws.send(JSON.stringify({
                    type: 'CONNECT',
                    sessionId,
                    player: this.cycle,
                    playerData: {
                        x: 0,
                        y: 0,
                        direction: 'DOWN',
                        currentAnimation: 'IDLE',
                        state: 'ALIVE'
                    }
                }));

                interval = setInterval(() => {
                    this.ws.send(JSON.stringify({
                        type: 'PING',
                        sessionId,
                        player: this.cycle,
                        playerData: {
                            x: 0,
                            y: 0,
                            direction: 'DOWN',
                            currentAnimation: 'IDLE',
                            state: 'ALIVE'
                        }
                    }));
                }, 10000);
            };
            this.ws.onmessage = (message: MessageEvent) => {
                let event : WSEvent = JSON.parse(message.data);
                this.game.scale.setGameSize(levels[this.levelId].blocksX * config.BLOCK_SIZE, levels[this.levelId].blocksY * config.BLOCK_SIZE);
                switch (event.type) {
                    case 'READY':
                        console.log('OTHER PLAYER READY');
                        this.state = 'PLAYING';
                        this.level = new Level(this, levels[this.levelId]);
                        if (this.cycle === 'day') {
                            this.music = this.sound.add('day-music');
                            this.music.play();
                            this.player = new Player(this, levels[this.levelId].player1Start.x * config.BLOCK_SIZE, levels[this.levelId].player1Start.y * config.BLOCK_SIZE, (player) => { this.onPlayerMove(player, ws) });
                            this.remote = new Cat(this, levels.level1.player2Start.x * config.BLOCK_SIZE, levels.level1.player2Start.y * config.BLOCK_SIZE);
                            this.physics.add.collider(this.player, this.remote, () => {
                                let text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "You got the key...\nbut night\nsnuffs out\nthe light of day.", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
                                text.depth = 999;
                                text.setOrigin(0.5, 0.5);
                                this.cameras.main.zoomTo(1.0);
                                this.cameras.main.stopFollow();
                                this.cameras.main.centerOn(0.5 * this.game.scale.width, 0.5 * this.game.scale.height);
                                setTimeout(() => {
                                    this.state = "COMPLETED";
                                }, 5000);
                            });
                            this.physics.add.collider(this.remote, this.level.exit, () => {
                                let text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "You failed...\na night of terror awaits", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
                                text.depth = 999;
                                text.setOrigin(0.5, 0.5);
                                this.cameras.main.zoomTo(1.0);
                                this.cameras.main.stopFollow();
                                this.cameras.main.centerOn(0.5 * this.game.scale.width, 0.5 * this.game.scale.height);
                                setTimeout(() => {
                                    this.state = "FAILED";
                                }, 5000);
                            });
                            this.cameras.main.startFollow(this.player);
                            this.cameras.main.zoom = 2.0;
                        } else if (this.cycle === 'night') {
                            this.music = this.sound.add('night-music');
                            this.music.play();
                            this.player = new Mouse(this, levels[this.levelId].player2Start.x * config.BLOCK_SIZE, levels[this.levelId].player2Start.y * config.BLOCK_SIZE, (player) => { this.onPlayerMove(player, ws) });
                            this.remote = new Monster(this, levels[this.levelId].player1Start.x * config.BLOCK_SIZE, levels[this.levelId].player1Start.y * config.BLOCK_SIZE);
                            this.physics.add.collider(this.remote, this.player, () => {
                                let text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "You were consumed\nby the darkness...\nmorning comes.", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
                                text.depth = 999;
                                text.setOrigin(0.5, 0.5);
                                this.cameras.main.zoomTo(1.0);
                                this.cameras.main.stopFollow();
                                this.cameras.main.centerOn(0.5 * this.game.scale.width, 0.5 * this.game.scale.height);
                                setTimeout(() => {
                                    this.state = "FAILED";
                                }, 5000);
                            });
                            this.physics.add.collider(this.player, this.level.exit, () => {
                                let text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "You escaped the room, \nbut tomorrow \nbrings more of the same!", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
                                text.depth = 999;
                                text.setOrigin(0.5, 0.5);
                                this.cameras.main.zoomTo(1.0);
                                this.cameras.main.stopFollow();
                                this.cameras.main.centerOn(0.5 * this.game.scale.width, 0.5 * this.game.scale.height);
                                setTimeout(() => {
                                    this.state = "COMPLETED";
                                }, 5000);
                            });
                            this.cameras.main.startFollow(this.player);
                            this.cameras.main.zoom = 4.0;
                        }
                        text.destroy();
                        break;
                    case 'UPDATE':
                        this.onRemoteMove(event);
                        break;
                }
            };
            this.ws.onclose = () => {
                console.log('SOCKET CLOSED');
                clearInterval(interval);
                this.scene.start('ErrorScene', { errorMessage: 'Socket closed' });
            };
            this.ws.onerror = () => {
                console.log('ERROR');
                clearInterval(interval);
                this.scene.start('ErrorScene', { errorMessage: 'Socket failure' });
            };
        } catch (errorMessage) {
            console.log('CAUGHT ERROR: ' + errorMessage);
            this.scene.start('ErrorScene', { errorMessage });
        }
    }

    update() {
        if (this.state === 'PLAYING') {
            this.player.update();
            this.remote.update();
            this.level.update();
        } else if (this.state === 'COMPLETE' || this.state === 'FAIL') {
            if (this.cycle === 'day') {
                this.scene.start('CycleScene', { cycle: 'night' });
            } else {
                this.scene.start('CycleScene', { cycle: 'day' });
            }
        }
    }
}
