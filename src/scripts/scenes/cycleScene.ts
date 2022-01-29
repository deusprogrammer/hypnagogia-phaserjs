import {Player, Cat, Mouse, Monster} from '../objects/sprites';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { AbstractPausableScene } from './abstractPausableScene';

let urlParams = new URLSearchParams(window.location.search);
let sessionId = urlParams.get('sessionId');

export default class CycleScene extends AbstractPausableScene {
    state; 
    player;
    remote;
    ws;
    cycle;

    constructor() {
        super({ key: 'CycleScene' });
        this.state = 'WAITING';
    }

    init({cycle}) {
        this.cycle = cycle;
    }

    onPlayerMove(player, ws) {
        let {direction, x, y} = player;
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

    onRemoteMove({playerData: {x, y, direction, currentAnimation}}) {
        this.remote.x = x;
        this.remote.y = y;
        this.remote.direction = direction;
        this.remote.play(currentAnimation, true);
    }

    create() {
        if (this.cycle === 'day') {
            this.cameras.main.setBackgroundColor('#FFFFFF');
        } else if (this.cycle === 'night') {
            this.cameras.main.setBackgroundColor('#000000');
        }
        let ws;
        let text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "Falling Asleep...Sweet Dreams", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
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
                        animation: 'IDLE',
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
                            animation: 'IDLE',
                            state: 'ALIVE'
                        }
                    }));
                }, 10000);
            };
            this.ws.onmessage = (message) => {
                let event = JSON.parse(message.data);
                console.log("EVENT: " + JSON.stringify(event, null, 5));
                switch (event.type) {
                    case "READY":
                        console.log("OTHER PLAYER READY");
                        this.state = "PLAYING";
                        if (this.cycle === 'day') {
                            this.player = new Player(this, 0, 0, (player) => {this.onPlayerMove(player, ws)});
                            this.remote = new Cat(this, 100, 100);
                        } else if (this.cycle === 'night') {
                            this.player = new Mouse(this, 100, 100, (player) => {this.onPlayerMove(player, ws)});
                            this.remote = new Monster(this, 0, 0);
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
                this.scene.start('ErrorScene', {errorMessage: "Socket closed"});
            }
            this.ws.onerror = (errorMessage) => {
                console.log("ERROR: " + errorMessage.data);
                clearInterval(interval);
                this.scene.start('ErrorScene', {errorMessage: "Socket failure"});
            }
        } catch (errorMessage) {
            console.log("CAUGHT ERROR: " + errorMessage);
            this.scene.start('ErrorScene', {errorMessage});
        }
    }

    update() {
        if (this.state === "PLAYING") {
            this.player.update();
            this.remote.update();
        } else if (this.state === 'COMPLETE') {
            if (this.cycle === 'day') {
                this.scene.start('CycleScene', {cycle: 'night'});
            } else {
                this.scene.start('CycleScene', {cycle: 'day'});
            }
        }
    }
}
