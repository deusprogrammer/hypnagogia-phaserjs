import 'phaser';
import { Scene } from 'phaser';
import config from '../config';
import { LevelConfig } from '../data/levels';

export default class Level extends Phaser.GameObjects.GameObject {
	levelConfig: LevelConfig;
	enableBody: boolean;
	blocks: Phaser.GameObjects.Group;
	moveable: Phaser.GameObjects.Group;

	constructor(scene : Scene, levelConfig : LevelConfig) {
		super(scene, 'level');
		this.levelConfig = levelConfig;
		this.enableBody = true;

		this.blocks = this.scene.add.group();
		this.moveable = this.scene.add.group();

		for (let y = 0; y < this.levelConfig.blocksY; y++) {
			for (let x = 0; x < this.levelConfig.blocksX; x++) {
				if (this.levelConfig.tilemap[y][x] == "*") {
					let block = this.blocks.create(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.blockAsset);
					this.scene.physics.add.existing(block);
					block.setOrigin(0,0);
					block.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST, config.BB_ADJUST / 2, - config.BB_ADJUST / 2);
					block.body.immovable = true;
					console.log("BLOCK:  " + block.x + ", " + block.y);
				} else if (this.levelConfig.tilemap[y][x] == "#") {
					let block = this.moveable.create(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.breakableAsset);
					this.scene.physics.add.existing(block);
					block.setOrigin(0,0);
					block.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST, config.BB_ADJUST / 2, - config.BB_ADJUST / 2);
					block.body.immovable = false;
					console.log("MBLOCK:   " + block.x + ", " + block.y);
				}
			}
		}
	}

	getTile(x: number, y: number) : string {
		return this.levelConfig.tilemap[y][x];
	}

	clearTile(x: number, y: number) {
		this.levelConfig.tilemap[y][x] = ' ';
	}

	isBlockPassable(x: number, y: number) : boolean {
		return x >= 0 && y >= 0 && x < this.levelConfig.blocksX && y < this.levelConfig.blocksY && this.getTile(x, y) === ' ';
	}

	isBlockPassableAndNotBreakable(x: number, y: number) : boolean {
		return x >= 0 && y >= 0 && x < this.levelConfig.blocksX && y < this.levelConfig.blocksY && this.getTile(x, y) !== '*';
	}

	isBlockBreakable(x: number, y: number) : boolean {
		return this.getTile(x, y) === '#';
	}
}