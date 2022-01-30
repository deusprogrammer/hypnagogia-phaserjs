import config from "../config";
import levels, {assetMap, AssetMapEntry} from "../data/levels";

let urlParams = new URLSearchParams(window.location.search);
let cycle = urlParams.get('cycle');

export default class PreloadScene extends Phaser.Scene {
    graphics;
    newGraphics;
    loadingText;
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.graphics = this.add.graphics();
		this.newGraphics = this.add.graphics();
        this.load.on('progress', (percentage) => {
            this.newGraphics.clear();
            this.newGraphics.fillStyle(0x3587e2, 1);
            this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(205, 205, percentage * 390, 40));
                    
            percentage = percentage * 100;
            this.loadingText.setText("Hypnagogia\nLoading: " + percentage.toFixed(2) + "%");
        });

        this.load.spritesheet('playerSprite', 'assets/img/player.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('catSprite', 'assets/img/cat.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('mouseSprite', 'assets/img/mouse.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.spritesheet('monsterSprite', 'assets/img/monster.png', { frameWidth: config.BLOCK_SIZE, frameHeight: config.BLOCK_SIZE });
        this.load.image('button', 'assets/img/button.png');
        this.load.image('panel', 'assets/img/panel.png');
        this.load.image('floor1', 'assets/img/floor.png');
        this.load.audio('night-music', 'assets/music/night.mp3');
        this.load.audio('day-music', 'assets/music/day.mp3');

        let progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 50);
		let progressBarFill = new Phaser.Geom.Rectangle(205, 205, 290, 40);

		this.graphics.fillStyle(0xffffff, 1);
		this.graphics.fillRectShape(progressBar);

		this.newGraphics.fillStyle(0x3587e2, 1);
		this.newGraphics.fillRectShape(progressBarFill);

		this.loadingText = this.add.text(250,260,"Loading: ", { fontSize: '32px', color: "0xFFF" });

        Object.keys(assetMap).forEach(key => {
            let asset : AssetMapEntry = assetMap[key];
            this.load.image(asset.name, asset.file);
            console.log("LOADING: " + asset.name + " => " + asset.file);
        });
    }

    updateBar(percentage) {
        
    }

    create() {
        this.scene.start('CycleScene', {cycle});
    }
}
