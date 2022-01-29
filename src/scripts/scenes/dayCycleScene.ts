import {Player, Cat} from '../objects/sprites';
import { AbstractPausableScene } from './abstractPausableScene';

export default class MainScene extends AbstractPausableScene {
    state;
    player;
    cat;

    constructor() {
        super({ key: 'DayCycleScene' });
        this.state = "PLAYING";
    }

    create() {
        super.create();
        this.player = new Player(this, 0, 0);
        this.cat = new Cat(this, 100, 100);
    }

    update() {
        this.player.update();
        this.cat.update();

        // On terminal condition
        if (this.state === "COMPLETE") {
            this.scene.start('NightCycleScene');
        }
    }
}
