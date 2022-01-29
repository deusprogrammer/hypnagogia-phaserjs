import 'phaser';
import config from '../config';
import { LevelConfig } from '../data/levels';
import CycleScene from '../scenes/cycleScene';
import { StaticObject, PushableObject } from './sprites';

export default class Level extends Phaser.GameObjects.GameObject {
	levelConfig: LevelConfig;
	blocks: Phaser.Physics.Arcade.Group;
	moveable: Phaser.Physics.Arcade.Group;

	constructor(scene : CycleScene, levelConfig : LevelConfig) {
		super(scene, 'level');
		this.levelConfig = levelConfig;

		this.blocks = this.scene.physics.add.group();
		this.moveable = this.scene.physics.add.group();

		for (let y = 0; y < this.levelConfig.blocksY; y++) {
			for (let x = 0; x < this.levelConfig.blocksX; x++) {
				if (this.levelConfig.tilemap[y][x] == "*") {
					let block = new StaticObject(scene, x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.blockAsset);
					this.blocks.add(block);
				} else if (this.levelConfig.tilemap[y][x] == "#") {
					let block = new PushableObject(scene, x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.breakableAsset);
					this.moveable.add(block);
					block.setDrag(2000, 2000);
					this.scene.physics.add.collider(block, scene.player);
					this.scene.physics.add.collider(block, scene.remote);
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

	update() {
		this.blocks.children.each((block) => {
			block.update();
		}, this);
		this.moveable.children.each((block) => {
			block.update();
		}, this);
	}
}