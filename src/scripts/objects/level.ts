import 'phaser';
import config from '../config';
import { assetMap, AssetMapEntry, LevelConfig } from '../data/levels';
import CycleScene from '../scenes/cycleScene';
import { PushableObject } from './sprites';

export default class Level extends Phaser.GameObjects.GameObject {
	levelConfig: LevelConfig;
	blocks: Phaser.Physics.Arcade.Group;
	moveable: Phaser.Physics.Arcade.Group;
	hidingSpots : Phaser.Physics.Arcade.Group;
	floor: Phaser.GameObjects.Group;
	exit: Phaser.Physics.Arcade.Sprite;

	constructor(scene : CycleScene, levelConfig : LevelConfig) {
		super(scene, 'level');
		this.levelConfig = levelConfig;

		scene.add.existing(this);

		this.floor = this.scene.add.group();
		this.blocks = this.scene.physics.add.group();
		this.moveable = this.scene.physics.add.group();
		this.hidingSpots = this.scene.physics.add.group();

		for (let y = 0; y < this.levelConfig.blocksY; y++) {
			for (let x = 0; x < this.levelConfig.blocksX; x++) {
				// Draw floor
				let floorBlock = this.scene.add.image(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, this.levelConfig.floorAsset);
				if (scene.cycle === 'night') {
					floorBlock.tint = this.levelConfig.nightTint;
				}
				floorBlock.setOrigin(0, 0);
				this.floor.add(floorBlock);

				let asset : AssetMapEntry = assetMap[this.levelConfig.tilemap[y][x]];
				let block : Phaser.Physics.Arcade.Sprite;
				if (!asset) {
					continue;
				} else if (asset.canPush) {
					block = new PushableObject(scene, x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, asset.name);
					this.moveable.add(block);
				} else if (asset.canHide) {
					block = scene.physics.add.sprite(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, asset.name);
					if (scene.cycle === 'night') {
						this.hidingSpots.add(block);
					} else {
						this.blocks.add(block);
					}
				} else if (asset.isExit && !this.exit) {
					block = scene.physics.add.sprite(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, asset.name);
					this.exit = block;
				} else {
					block = scene.physics.add.sprite(x * config.BLOCK_SIZE, y * config.BLOCK_SIZE, asset.name);
					this.blocks.add(block);
				}

				block.depth = y * config.BLOCK_SIZE + 5;
				block.setOrigin(0, 0);
				block.setPushable(false);

				if (scene.cycle === 'night') {
					block.tint = this.levelConfig.nightTint;
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

	setTile(x: number, y: number) {
		this.levelConfig.tilemap[y][x] = '#';
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