import { Player, Cat, Mouse, Monster, RemoteControlledSprite, PlayerControlledSprite, AbstractSprite } from '../objects/sprites';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { AbstractPausableScene } from './abstractPausableScene';
import Level from '../objects/level';
import levels from '../data/levels';
import config from '../config';

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
        this.remote.body.velocity.x = velocity.x;
        this.remote.body.velocity.y = velocity.y;
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
            ws = this.ws = new W3CWebSocket('ws://localhost:8081');
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
                            this.player = new Player(this, levels[this.levelId].player1Start.x * config.BLOCK_SIZE, levels[this.levelId].player1Start.y * config.BLOCK_SIZE, (player) => { this.onPlayerMove(player, ws) });
                            this.remote = new Cat(this, levels.level1.player2Start.x * config.BLOCK_SIZE, levels.level1.player2Start.y * config.BLOCK_SIZE);
                        } else if (this.cycle === 'night') {
                            this.player = new Mouse(this, levels[this.levelId].player2Start.x * config.BLOCK_SIZE, levels[this.levelId].player2Start.y * config.BLOCK_SIZE, (player) => { this.onPlayerMove(player, ws) });
                            this.remote = new Monster(this, levels[this.levelId].player1Start.x * config.BLOCK_SIZE, levels[this.levelId].player1Start.y * config.BLOCK_SIZE);
                            this.cameras.main.startFollow(this.player);
                            this.cameras.main.zoom = 3.0;
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
        } else if (this.state === 'COMPLETE') {
            if (this.cycle === 'day') {
                this.scene.start('CycleScene', { cycle: 'night' });
            } else {
                this.scene.start('CycleScene', { cycle: 'day' });
            }
        }
    }
}
