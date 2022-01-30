import config from "../config";
import levels, {assetMap, AssetMapEntry} from "../data/levels";

let urlParams = new URLSearchParams(window.location.search);
let cycle = urlParams.get('cycle');

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.spritesheet('playerSprite', 'assets/img/player.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('catSprite', 'assets/img/cat.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('mouseSprite', 'assets/img/mouse.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('monsterSprite', 'assets/img/monster.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.image('button', 'assets/img/button.png');
        this.load.image('panel', 'assets/img/panel.png');
        this.load.image('floor1', 'assets/img/floor.png');
        this.load.audio('night-music', 'assets/music/night.mp3');
        this.load.audio('day-music', 'assets/music/day.mp3');

        Object.keys(assetMap).forEach(key => {
            let asset : AssetMapEntry = assetMap[key];
            this.load.image(asset.name, asset.file);
            console.log("LOADING: " + asset.name + " => " + asset.file);
        })
    }

    create() {
        this.scene.start('CycleScene', {cycle});
        // this.scene.start('StartScene');
    }
}
