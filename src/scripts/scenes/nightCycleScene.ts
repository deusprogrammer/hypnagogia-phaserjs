import { Monster, Mouse } from "../objects/sprites";
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);
let sessionId = urlParams.get('sessionId');

export default class NightCycleScene extends Phaser.Scene {
    remote;
    player;
    state;
    ws;

    constructor() {
        super({ key: 'NightCycleScene' });
        this.state = 'PLAYING';
    }

    onPlayerMove(player, ws) {
        let {direction, x, y} = player;
        ws.send(JSON.stringify({
            type: "UPDATE",
            sessionId,
            player: 'night',
            playerData: {
                direction, 
                x, 
                y, 
                currentAnimation: player.anims.currentAnim.key
            }
        }));
    }

    onRemoteMove({playerData: {x, y, direction, currentAnimation}}) {
        this.remote.x = x;
        this.remote.y = y;
        this.remote.direction = direction;
        this.remote.play(currentAnimation, true);
    }

    create() {
        let ws = this.ws = new W3CWebSocket('ws://localhost:8081');
        this.ws.onopen = () => {
            console.log("CONNECTED TO WEBSOCKET");
            this.ws.send(JSON.stringify({
                type: 'CONNECT',
                sessionId,
                player: 'night',
                playerData: {
                    x: 0,
                    y: 0,
                    direction: 'DOWN',
                    animation: 'IDLE',
                    state: 'ALIVE'
                }
            }));
        };
        this.ws.onmessage = (message) => {
            let event = JSON.parse(message.data);
            console.log("EVENT: " + JSON.stringify(event, null, 5));
            this.onRemoteMove(event);
        };
        this.player = new Mouse(this, 100, 100, (player) => {this.onPlayerMove(player, ws)});
        this.remote = new Monster(this, 0, 0);
    }

    update() {
        this.remote.update();
        this.player.update();

        // On terminal condition
        if (this.state === 'COMPLETE') {
            this.scene.start('DayCycleScene');
        }
    }
}
