import 'phaser'
import {createPlayerAnimation} from '../helpers/animationHelper';
import CycleScene from '../scenes/cycleScene';
import config from '../config';
import levels from '../data/levels';

type CallbackFunction = (player: PlayerControlledSprite) => void;
type Coord = {x: number, y: number};
type PlayerControls = {up: Phaser.Input.Keyboard.Key, down: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key,};

const DIRECTIONS = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
}

const VELOCITY: number = 500;

export class AbstractSprite extends Phaser.Physics.Arcade.Sprite {
    direction: string;
    block: Coord;
    center: Coord;
    adjacentBlock: Phaser.GameObjects.Rectangle;

    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0,0);
        this.setCollideWorldBounds(true);
        this.body.checkCollision = {
            none: false,
            up: true,
            down: true,
            left: true,
            right: true
        };
        this.direction = DIRECTIONS.left;
        this.block = {x: 0, y: 0};
        this.center = {x: 0, y: 0};
    }
}

class MoveableObject extends AbstractSprite {
    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }

    update() {
        this.center.x = this.x + config.BLOCK_SIZE/2;
        this.center.y = this.y + config.BLOCK_SIZE/2;

        this.block.x = Math.floor(this.center.x / config.BLOCK_SIZE);
        this.block.y = Math.floor(this.center.y / config.BLOCK_SIZE);

        this.adjustForCollisions();
    }

    adjustForCollisions() {
        let scene = this.scene as CycleScene;
        let collided = this.scene.physics.collide(this, scene.level.blocks) || scene.physics.collide(this, scene.level.moveable) || scene.physics.collide(this, scene.player)  || scene.physics.collide(this, scene.remote);
        let adjacentBlock = this.getFacingBlock();

        // Check for obstacle collision
        if (collided && scene.level.isBlockPassable(adjacentBlock.x, adjacentBlock.y)) {
            let delta = this.findDeltaFromPassing();

            let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

            if (distance <= config.ALLOWED_DISTANCE) {
                this.adjustToCurrentBlock();
            }
        }
    }

    adjustToCurrentBlock() : void {
        this.x = this.block.x * config.BLOCK_SIZE;
        this.y = this.block.y * config.BLOCK_SIZE;
    }

    getFacingBlock() : Coord {
        let adjacentBlock : Coord = {x: 0, y: 0};
        if (this.direction == "up") {
            adjacentBlock.x = this.block.x;
            adjacentBlock.y = this.block.y - 1;
        } else if (this.direction == "down") {
            adjacentBlock.x = this.block.x;
            adjacentBlock.y = this.block.y + 1;
        } else if (this.direction == "left") {
            adjacentBlock.x = this.block.x - 1;
            adjacentBlock.y = this.block.y;
        } else if (this.direction == "right") {
            adjacentBlock.x = this.block.x + 1;
            adjacentBlock.y = this.block.y;
        }

        if (this.adjacentBlock) {
            this.adjacentBlock.destroy();
        }
        this.adjacentBlock = this.scene.add.rectangle(adjacentBlock.x * config.BLOCK_SIZE, adjacentBlock.y * config.BLOCK_SIZE, config.BLOCK_SIZE, config.BLOCK_SIZE);
        this.adjacentBlock.setStrokeStyle(2, 0x1a65ac);
        this.adjacentBlock.setOrigin(0, 0);

        return adjacentBlock;
    }

    findDeltaFromPassing() : Coord {
        let idealBlock = {center: {x: 0, y: 0}};
        idealBlock.center.x = (this.block.x * config.BLOCK_SIZE) + config.BLOCK_SIZE/2;
        idealBlock.center.y = (this.block.y * config.BLOCK_SIZE) + config.BLOCK_SIZE/2;

        let delta = {x: 0, y: 0};
        delta.x = Math.abs(this.center.x - idealBlock.center.x);
        delta.y = Math.abs(this.center.y - idealBlock.center.y);

        return delta;
    }
}

export class PushableObject extends MoveableObject {
    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.setPushable(true);
    }

    update() {
        super.update();

        if (this.body.velocity.y > 0) {
            this.direction = DIRECTIONS.up;
        } else if (this.body.velocity.y < 0) {
            this.direction = DIRECTIONS.down;
        } else if (this.body.velocity.x < 0) {
            this.direction = DIRECTIONS.right;
        } else if (this.body.velocity.x > 0) {
            this.direction = DIRECTIONS.left;
        }
    }
}

export class StaticObject extends AbstractSprite {
    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.setPushable(false);
    }

    update() {
        super.update();
    }
}

class AnimatedSprite extends MoveableObject {
    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        createPlayerAnimation(this, texture, 3);
    }

    update() {
        super.update();
    }
}

/* 
This sprite is controlled directly by the player.  
It's movements will be sent to other player via websocket.
*/
export class PlayerControlledSprite extends AnimatedSprite {
    // pauseMenu;
    controls: PlayerControls;
    movementCallback: CallbackFunction;
    direction: string;

    constructor(scene: CycleScene, x: number, y: number, texture: string, movementCallback: CallbackFunction) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.movementCallback = movementCallback;
        this.direction = DIRECTIONS.down;
        this.controls = {
            up: this.scene.input.keyboard.addKey('W'),
            down: this.scene.input.keyboard.addKey('S'),
            left: this.scene.input.keyboard.addKey('A'),
            right: this.scene.input.keyboard.addKey('D'),
        };
        // scene.input.keyboard.on('keydown-' + 'P', this.toggleUI);
        this.setInteractive();
    }

    update() {
        super.update();

        // Controls
        if (this.controls.down.isDown) {
            this.direction = DIRECTIONS.down;
            this.setVelocityX(0);
            this.setVelocityY(VELOCITY);
            this.play('walk-down', true);
            this.movementCallback(this);
        } else if (this.controls.up.isDown) {
            this.direction = DIRECTIONS.up;
            this.setVelocityX(0);
            this.setVelocityY(-VELOCITY);
            this.play('walk-up', true);
            this.movementCallback(this);
        } else if (this.controls.right.isDown) {
            this.direction = DIRECTIONS.right;
            this.setVelocityX(VELOCITY);
            this.setVelocityY(0);
            this.play('walk-right', true);
            this.movementCallback(this);
        } else if (this.controls.left.isDown) {
            this.direction = DIRECTIONS.left;
            this.setVelocityX(-VELOCITY);
            this.setVelocityY(0);
            this.play('walk-left', true);
            this.movementCallback(this);
        } else {
            this.setVelocityX(0);
            this.setVelocityY(0);
            this.play(`idle-${this.direction}`);
        }
    }

    // toggleUI() {
    //     if(this.scene.isPaused) {
    //         this.pauseMenu.disableUI();
    //         this.scene.isPaused = false;
    //     }
    //     else {
    //         this.pauseMenu = new StartUI(this.scene, 600, 300);
    //         this.scene.isPaused = true;
    //     }
    // }
}

export class Player extends PlayerControlledSprite {
    constructor(scene: CycleScene, x: number, y: number, movementCallback: CallbackFunction) {
        super(scene, x, y, 'playerSprite', movementCallback);
    }

    update() {
        super.update();
    }
}

export class Mouse extends PlayerControlledSprite {
    constructor(scene: CycleScene, x: number, y: number, movementCallback: CallbackFunction) {
        super(scene, x, y, 'mouseSprite', movementCallback);
    }

    update() {
        super.update();
    }
}

// This sprite is controlled via websocket and is connected to the other player
export class RemoteControlledSprite extends AnimatedSprite {
    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }

    update() {
        super.update();
    }
}

export class Cat extends RemoteControlledSprite {
    constructor(scene: CycleScene, x: number, y: number) {
        super(scene, x, y, 'catSprite');
    }

    update() {
        super.update();
    }
}

export class Monster extends RemoteControlledSprite {
    constructor(scene: CycleScene, x: number, y: number) {
        super(scene, x, y, 'monsterSprite');
    }

    update() {
        super.update();
    }
}