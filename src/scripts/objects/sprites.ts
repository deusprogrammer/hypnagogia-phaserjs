import 'phaser'
import {createPlayerAnimation} from '../helpers/animationHelper';
import { AbstractPausableScene } from '../scenes/abstractPausableScene';
import { StartUI } from './startUI';

let directions = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
}

class AbstractSprite extends Phaser.Physics.Arcade.Sprite {
    direction;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        createPlayerAnimation(this, texture, 3);
        this.setCollideWorldBounds(true);
    }
}

/* 
This sprite is controlled directly by the player.  
It's movements will be sent to other player via websocket.
*/
class PlayerControlledSprite extends AbstractSprite {
    controls;
    pauseMenu;
    scene;
    

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.controls = {
            up: this.scene.input.keyboard.addKey('W'),
            down: this.scene.input.keyboard.addKey('S'),
            left: this.scene.input.keyboard.addKey('A'),
            right: this.scene.input.keyboard.addKey('D'),
        };
        scene.input.keyboard.on('keydown-' + 'P', this.toggleUI);
        this.setInteractive();
    }

    update() {
        // Controls
        if (this.controls.down.isDown) {
            this.direction = directions.down;
            this.setVelocityX(0);
            this.setVelocityY(100);
            this.play('walk-down', true);
        } else if (this.controls.up.isDown) {
            this.direction = directions.up;
            this.setVelocityX(0);
            this.setVelocityY(-100);
            this.play('walk-up', true);
        } else if (this.controls.right.isDown) {
            this.direction = directions.right;
            this.setVelocityX(100);
            this.setVelocityY(0);
            this.play('walk-right', true);
        } else if (this.controls.left.isDown) {
            this.direction = directions.right;
            this.setVelocityX(-100);
            this.setVelocityY(0);
            this.play('walk-left', true);
        } else {
            this.setVelocityX(0);
            this.setVelocityY(0);
            this.play(`idle-${this.direction}`);
        }
    }

    toggleUI() {
        if(this.scene.isPaused) {
            this.pauseMenu.disableUI();
            this.scene.isPaused = false;
        }
        else {
            this.pauseMenu = new StartUI(this.scene, 600, 300);
            this.scene.isPaused = true;
        }
    }
}

export class Player extends PlayerControlledSprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerSprite');
    }

    update() {
        super.update();
    }
}

export class Mouse extends PlayerControlledSprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mouseSprite');
    }

    update() {
        super.update();
    }
}

// This sprite is controlled via websocket and is connected to the other player
class RemoteControlledSprite extends AbstractSprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }

    update() {
        // TODO Figure out best way to control from websocket
    }
}

export class Cat extends RemoteControlledSprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'catSprite');
    }

    update() {
        super.update();
    }
}

export class Monster extends RemoteControlledSprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'monsterSprite');
    }

    update() {
        super.update();
    }
}