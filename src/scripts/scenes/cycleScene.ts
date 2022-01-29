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

    constructor() {
        super({ key: 'CycleScene' });
        this.state = 'WAITING';
    }

    onPlayerMove(player: PlayerControlledSprite, ws: WebSocket) {
        let { direction, x, y } = player;
        ws.send(JSON.stringify({
            type: "UPDATE",
            sessionId,
            player: this.cycle,
            playerData: {
                direction,
                x,
                y,
                currentAnimation: player.anims.currentAnim.key
            }
        }));
    }

    onRemoteMove({ playerData: { x, y, direction, currentAnimation } }: WSEvent) {
        this.remote.x = x;
        this.remote.y = y;
        this.remote.direction = direction;
        this.remote.play(currentAnimation, true);
    }

    adjustForCollisions(player: AbstractSprite, level: Level) {
        let hitPlatform = this.physics.collide(player, level.blocks);
        let adjacentBlock = player.getFacingBlock();

        // Check for obstacle collision
        if (hitPlatform && level.isBlockPassable(adjacentBlock.x, adjacentBlock.y)) {
            let delta = player.findDeltaFromPassing();

            let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

            if (distance <= config.ALLOWED_DISTANCE) {
                player.adjustToCurrentBlock();
            }
        }
    }

    init({ cycle }) {
        this.cycle = cycle;
    }

    create() {
        if (this.cycle === 'day') {
            this.cameras.main.setBackgroundColor('#FFFFFF');
        } else if (this.cycle === 'night') {
            this.cameras.main.setBackgroundColor('#000000');
            this.cameras.main.zoom = 3.0;
        }

        this.level = new Level(this, levels.level1);

        let ws : WebSocket;
        let text : Phaser.GameObjects.Text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "Falling Asleep...Sweet Dreams", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
        text.setOrigin(0.5, 0.5);
        try {
            let interval;
            ws = this.ws = new W3CWebSocket('ws://localhost:8081');
            this.ws.onopen = () => {
                console.log("CONNECTED TO WEBSOCKET");
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
                console.log("EVENT: " + JSON.stringify(event, null, 5));
                switch (event.type) {
                    case "READY":
                        console.log("OTHER PLAYER READY");
                        this.state = "PLAYING";
                        if (this.cycle === 'day') {
                            this.player = new Player(this, 0, 0, (player) => { this.onPlayerMove(player, ws) });
                            this.remote = new Cat(this, 100, 100);
                        } else if (this.cycle === 'night') {
                            this.player = new Mouse(this, 100, 100, (player) => { this.onPlayerMove(player, ws) });
                            this.remote = new Monster(this, 0, 0);
                            this.cameras.main.startFollow(this.player);
                        }
                        text.destroy();
                        break;
                    case "UPDATE":
                        this.onRemoteMove(event);
                        break;
                }
            };
            this.ws.onclose = () => {
                console.log("SOCKET CLOSED");
                clearInterval(interval);
                this.scene.start('ErrorScene', { errorMessage: "Socket closed" });
            }
            this.ws.onerror = () => {
                console.log("ERROR");
                clearInterval(interval);
                this.scene.start('ErrorScene', { errorMessage: "Socket failure" });
            }
        } catch (errorMessage) {
            console.log("CAUGHT ERROR: " + errorMessage);
            this.scene.start('ErrorScene', { errorMessage });
        }
    }

    update() {
        if (this.state === "PLAYING") {
            this.player.update();
            this.remote.update();
            
            this.adjustForCollisions(this.player, this.level);
            this.adjustForCollisions(this.remote, this.level);

        } else if (this.state === 'COMPLETE') {
            if (this.cycle === 'day') {
                this.scene.start('CycleScene', { cycle: 'night' });
            } else {
                this.scene.start('CycleScene', { cycle: 'day' });
            }
        }
    }
}
