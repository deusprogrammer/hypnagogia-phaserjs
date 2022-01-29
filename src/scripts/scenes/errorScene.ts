export default class ErrorScene extends Phaser.Scene {
    errorMessage;

    constructor() {
        super({ key: 'ErrorScene' });
    }

    init({errorMessage}) {
        this.errorMessage = errorMessage;
    }

    create() {
        let text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, this.errorMessage, { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
        text.setOrigin(0.5, 0.5);
    }

    update() {
    }
}
