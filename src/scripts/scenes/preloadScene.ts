let urlParams = new URLSearchParams(window.location.search);
let cycle = urlParams.get('cycle');

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.spritesheet('playerSprite', 'assets/img/player.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('catSprite', 'assets/img/cat.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('mouseSprite', 'assets/img/player.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('monsterSprite', 'assets/img/cat.png', { frameWidth: 48, frameHeight: 48 });
        this.load.image('button', 'assets/img/button.png');
        this.load.image('panel', 'assets/img/panel.png');

    }

    create() {
        this.scene.start('CycleScene', {cycle});
        // this.scene.start('StartScene');
    }
}
