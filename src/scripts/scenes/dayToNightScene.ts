import 'phaser';

export default class DayToNightScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DayToNightScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "Falling Asleep...Sweet Dreams", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
        setTimeout(() => {
            this.scene.start('CycleScene', { cycle: 'night' });
        },
        10000);
    }
}