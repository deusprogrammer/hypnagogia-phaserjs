import 'phaser'
import {createPlayerAnimation} from '../helpers/animationHelper';
import CycleScene from '../scenes/cycleScene';
import config from '../config';
import { Body } from 'matter';

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
    hitBox : Phaser.GameObjects.Rectangle;

    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0,0);
        this.direction = DIRECTIONS.left;
        this.block = {x: 0, y: 0};
        this.center = {x: 0, y: 0};
    }

    update() {
        super.update();
    }
}

const SPEED = 2;
class MoveableObject extends AbstractSprite {
    adjacentBlock : Phaser.GameObjects.Rectangle;

    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.setCollideWorldBounds(true);

        this.adjacentBlock = this.scene.add.rectangle(5, 5, config.BLOCK_SIZE - 10, config.BLOCK_SIZE -10, 0xFF0000, 0.25);
        this.adjacentBlock.setOrigin(0, 0);
        this.adjacentBlock.setDepth(99999);
    }

    update() {
        super.update();
        this.center.x = this.x + config.BLOCK_SIZE/2;
        this.center.y = this.y + config.BLOCK_SIZE/2;

        this.block.x = Math.floor(this.center.x / config.BLOCK_SIZE);
        this.block.y = Math.floor(this.center.y / config.BLOCK_SIZE);

        this.depth = this.block.y;

        this.adjustForCollisions();

        let adjacent = this.getFacingBlock();
        this.adjacentBlock.setPosition((adjacent.x * config.BLOCK_SIZE) + 5, (adjacent.y * config.BLOCK_SIZE) + 5);
    }

    adjustForCollisions() : void {
        let scene = this.scene as CycleScene;
        let collided = this.scene.physics.collide(this, [scene.level.blocks, scene.level.moveable]);
        let overlapped = this.scene.physics.overlap(this, [scene.level.blocks, scene.level.moveable]);
        let adjacentBlock = this.getFacingBlock();

        // Check for obstacle collision
        if (collided || overlapped && scene.level.isBlockPassable(adjacentBlock.x, adjacentBlock.y)) {
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
    isMoving: boolean;
    movingDirection: number;
    targetCoords;

    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }

    update() {
        super.update();
        if (this.isMoving) {
            if (this.targetCoords.x) {
                this.x += this.movingDirection * SPEED;
                if (
                    (this.movingDirection > 0 && this.x >= this.targetCoords.x) || 
                    (this.movingDirection < 0 && this.x <= this.targetCoords.x )) {
                        this.x = this.targetCoords.x;
                        this.isMoving = false;
                }
            } else if (this.targetCoords.y) {
                this.y += this.movingDirection * SPEED;
                if (
                    (this.movingDirection > 0 && this.y >= this.targetCoords.y) || 
                    (this.movingDirection < 0 && this.y <= this.targetCoords.y )) {
                        this.y = this.targetCoords.y;
                        this.isMoving = false;
                }
            }
        }
    }

    moveToX(x: number) {
        if (this.isMoving) {
            return;
        }
        this.targetCoords = { x, y: null };
        this.movingDirection = this.x - this.targetCoords.x > 0 ? -1 : 1;
        this.isMoving = true;
        console.log(this.targetCoords);
        console.log({x: this.x, y: this.y});
    }

    moveToY(y: number) {
        if (this.isMoving) {
            return;
        }
        this.targetCoords = { x: null, y};
        this.movingDirection = this.y - this.targetCoords.y > 0 ? -1 : 1;
        this.isMoving = true;
        console.log(this.targetCoords);
        console.log({x: this.x, y: this.y});
    }

    adjustForCollisions() : void {
        let scene = this.scene as CycleScene;
        let collided = this.scene.physics.collide(this, [scene.level.blocks, scene.level.moveable]);
        let overlapped = this.scene.physics.overlap(this, [scene.level.blocks, scene.level.moveable]);
        let adjacentBlock = this.getFacingBlock();

        // Check for obstacle collision
        if (collided || overlapped && scene.level.isBlockPassable(adjacentBlock.x, adjacentBlock.y)) {
            let delta = this.findDeltaFromPassing();

            let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

            if (distance <= config.ALLOWED_DISTANCE) {
                this.adjustToCurrentBlock();
            }
        }
    }
}

class AnimatedSprite extends MoveableObject {
    constructor(scene: CycleScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        createPlayerAnimation(this, texture, 3);

        this.hitBox = scene.add.rectangle(this.center.x, this.center.y, this.width, this.height);
        this.scene.physics.add.existing(this.hitBox);
        this.hitBox.setOrigin(0.5, 0.5);

        // scene.physics.add.collider(this, scene.level.blocks);
    }

    update() {
        super.update();
        this.hitBox.setPosition(this.center.x, this.center.y);
    }
}

/* 
This sprite is controlled directly by the player.  
It's movements will be sent to other player via websocket.
*/
export class PlayerControlledSprite extends AnimatedSprite {
    // pauseMenu;
    controls: PlayerControls;
    isStopped: boolean;
    movementCallback: CallbackFunction;

    constructor(scene: CycleScene, x: number, y: number, texture: string, movementCallback: CallbackFunction) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.isStopped = false;
        this.movementCallback = movementCallback;
        this.controls = {
            up: this.scene.input.keyboard.addKey('W'),
            down: this.scene.input.keyboard.addKey('S'),
            left: this.scene.input.keyboard.addKey('A'),
            right: this.scene.input.keyboard.addKey('D'),
        };
    }

    update() {
        // Controls
        if (this.controls.down.isDown) {
            this.direction = DIRECTIONS.down;
            this.setVelocityX(0);
            this.setVelocityY(VELOCITY);
            // this.y += 5;
            this.play('walk-down', true);
            this.movementCallback(this);
            this.isStopped = false;
        } else if (this.controls.up.isDown) {
            this.direction = DIRECTIONS.up;
            this.setVelocityX(0);
            this.setVelocityY(-VELOCITY);
            // this.y -= 5;
            this.play('walk-up', true);
            this.movementCallback(this);
            this.isStopped = false;
        } else if (this.controls.right.isDown) {
            this.direction = DIRECTIONS.right;
            this.setVelocityX(VELOCITY);
            this.setVelocityY(0);
            // this.x += 5;
            this.play('walk-right', true);
            this.movementCallback(this);
            this.isStopped = false;
        } else if (this.controls.left.isDown) {
            this.direction = DIRECTIONS.left;
            this.setVelocityX(-VELOCITY);
            this.setVelocityY(0);
            // this.x -= 5;
            this.play('walk-left', true);
            this.movementCallback(this);
            this.isStopped = false;
        } else {
            this.setVelocityX(0);
            this.setVelocityY(0);
            this.play(`idle-${this.direction}`);
            if (!this.isStopped) {
                this.movementCallback(this);
                this.isStopped = true;
            }
        }

        super.update();
    }
}

export class Player extends PlayerControlledSprite {
    constructor(scene: CycleScene, x: number, y: number, movementCallback: CallbackFunction) {
        super(scene, x, y, 'playerSprite', movementCallback);
        scene.physics.add.collider(this, scene.level.moveable, onCollide);
    }

    update() {
        super.update();
    }
}

export class Mouse extends PlayerControlledSprite {
    constructor(scene: CycleScene, x: number, y: number, movementCallback: CallbackFunction) {
        super(scene, x, y, 'mouseSprite', movementCallback);
        this.tint = 0x555555;
        this.hitBox.scale = 0.25;
        // scene.physics.add.collider(this, scene.level.moveable);
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
        this.hitBox.scale = 0.25;
        // scene.physics.add.collider(this, scene.level.moveable);
    }

    update() {
        super.update();
    }
}

export class Monster extends RemoteControlledSprite {
    constructor(scene: CycleScene, x: number, y: number) {
        super(scene, x, y, 'monsterSprite');
        this.tint = 0x555555;
        this.hitBox.scale = 0.25;
        scene.physics.add.collider(this, scene.level.moveable, onCollide);
    }

    update() {
        super.update();
    }
}

let onCollide = (obj1, obj2) => {
    let player : AnimatedSprite = obj1 as AnimatedSprite;
    let moveable : PushableObject = obj2 as PushableObject;
    let scene : CycleScene = player.scene as CycleScene;
    
    moveable.direction = player.direction;
    let adjacentBlock : Coord = moveable.getFacingBlock();

    console.log("PUSH " + player.direction);

    if (moveable.isMoving) {
        return;
    }

    let bodies : Body[] = scene.physics.overlapRect((adjacentBlock.x * config.BLOCK_SIZE) + 5, (adjacentBlock.y * config.BLOCK_SIZE) + 5, config.BLOCK_SIZE - 10, config.BLOCK_SIZE - 10) as Body[];
    console.log("BODIES:   " + bodies);
    console.log("ADJACENT: " + adjacentBlock.x + ", " + adjacentBlock.y);
    switch (player.direction) {
        case DIRECTIONS.up:
            if (!scene.level.isBlockPassable(moveable.block.x, moveable.block.y - 1) || bodies.length > 0) {
                console.log("UNPASSABLE");
                return;
            }
            moveable.y -= config.BLOCK_SIZE;
            scene.level.clearTile(moveable.block.x, moveable.block.y);
            scene.level.setTile(moveable.block.x, moveable.block.y - 1);
            // moveable.moveToY(moveable.y - config.BLOCK_SIZE);
            break;
        case DIRECTIONS.down:
            if (!scene.level.isBlockPassable(moveable.block.x, moveable.block.y + 1) || bodies.length > 0) {
                console.log("UNPASSABLE");
                return;
            }
            moveable.y += config.BLOCK_SIZE;
            scene.level.clearTile(moveable.block.x, moveable.block.y);
            scene.level.setTile(moveable.block.x, moveable.block.y + 1);
            // moveable.moveToY(moveable.y + config.BLOCK_SIZE);
            break;
        case DIRECTIONS.left:
            if (!scene.level.isBlockPassable(moveable.block.x - 1, moveable.block.y) || bodies.length > 0) {
                console.log("UNPASSABLE");
                return;
            }
            moveable.x -= config.BLOCK_SIZE;
            scene.level.clearTile(moveable.block.x, moveable.block.y);
            scene.level.setTile(moveable.block.x - 1, moveable.block.y);
            // moveable.moveToX(moveable.x - config.BLOCK_SIZE);
            break;
        case DIRECTIONS.right:
            if (!scene.level.isBlockPassable(moveable.block.x + 1, moveable.block.y) || bodies.length > 0) {
                console.log("UNPASSABLE");
                return;
            }
            moveable.x += config.BLOCK_SIZE;
            scene.level.clearTile(moveable.block.x, moveable.block.y);
            scene.level.setTile(moveable.block.x + 1, moveable.block.y);
            // moveable.moveToX(moveable.x + config.BLOCK_SIZE);
            break;
    };
}