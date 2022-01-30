import 'phaser';

export default class NightToDayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NightToDayScene' });
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, "Waking Up...Good Morning!", { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
        setTimeout(() => {
            this.scene.start('CycleScene', { cycle: 'day' });
        },
        10000);
    }

    update(time: number, delta: number): void {
        
    }
}