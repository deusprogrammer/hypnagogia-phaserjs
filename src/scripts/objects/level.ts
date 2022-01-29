import 'phaser';
import { Scene } from 'phaser';
import config from '../config';
import { LevelConfig } from '../data/levels';

export default class Level extends Phaser.GameObjects.GameObject {
	levelConfig: LevelConfig;
	enableBody: boolean;
	blocks: Phaser.Physics.Arcade.Group;
	moveable: Phaser.Physics.Arcade.Group;

	constructor(scene : Scene, levelConfig : LevelConfig) {
		super(scene, 'level');
		this.levelConfig = levelConfig;
		this.enableBody = true;

		this.blocks = this.scene.physics.add.group();
		this.moveable = this.scene.physics.add.group();

		for (let y = 0; y < this.levelConfig.blocksY; y++) {
			for (let x = 0; x < this.levelConfig.blocksX; x++) {
				if (this.levelConfig.tilemap[y][x] == "*") {
					let block : Phaser.Physics.Arcade.Sprite = this.blocks.create(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.blockAsset);
					block.setOrigin(0,0);
					block.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST, true);
					block.body.immovable = true;
					this.scene.physics.add.collider(block, this.moveable);
				} else if (this.levelConfig.tilemap[y][x] == "#") {
					let block : Phaser.Physics.Arcade.Sprite = this.moveable.create(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.breakableAsset);
					block.setOrigin(0,0);
					block.body.setSize(config.BLOCK_SIZE - config.BB_ADJUST, config.BLOCK_SIZE - config.BB_ADJUST, true);
					block.body.immovable = false;
					block.setDrag(2000, 2000);
					this.scene.physics.add.collider(block, this.moveable);
					this.scene.physics.add.collider(block, this.blocks);
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