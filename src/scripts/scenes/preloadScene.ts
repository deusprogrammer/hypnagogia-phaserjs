import config from "../config";

let urlParams = new URLSearchParams(window.location.search);
let cycle = urlParams.get('cycle');

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.spritesheet('playerSprite', 'assets/img/player.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('catSprite', 'assets/img/cat.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('mouseSprite', 'assets/img/player.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('monsterSprite', 'assets/img/cat.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.image('button', 'assets/img/button.png');
        this.load.image('panel', 'assets/img/panel.png');
        this.load.image('block', 'assets/img/block.png');
        this.load.image('breakable', 'assets/img/breakable.png');
    }

    create() {
        this.scene.start('CycleScene', {cycle});
        // this.scene.start('StartScene');
    }
}
