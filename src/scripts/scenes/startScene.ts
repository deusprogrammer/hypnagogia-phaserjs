import {StartUI} from '../objects/startUI';

export default class StartScene extends Phaser.Scene {
    state;
    menu;
    

    constructor() {
        super({ key: 'StartScene' });
        this.state = "PLAYING";
    }

    create() {
       this.menu = new StartUI(this, 600, 350);
    }
}