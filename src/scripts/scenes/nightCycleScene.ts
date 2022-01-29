export default class MainScene extends Phaser.Scene {
    state;

    constructor() {
        super({ key: 'NightCycleScene' });
        this.state = "PLAYING";
    }

    create() {
    }

    update() {
        // On terminal condition
        if (this.state === "COMPLETE") {
            this.scene.start("DayCycleScene");
        }
    }
}
