import 'phaser'
import {createPlayerAnimation} from '../helpers/animationHelper';

class AbstractSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
    }

    create() {
        createPlayerAnimation(this, this.texture, 3);
    }
}

/* 
This sprite is controlled directly by the player.  
It's movements will be sent to other player via websocket.
*/
class PlayerControlledSprite extends AbstractSprite {
    controls;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.setInteractive();
    }

    create() {
        this.controls = {
            up: this.scene.input.keyboard.addKey("W"),
            left: this.scene.input.keyboard.addKey("S"),
            down: this.scene.input.keyboard.addKey("A"),
            right: this.scene.input.keyboard.addKey("D")
        };
    }

    update() {
        console.log("UPDATE");

        // Controls
        if (this.controls.up.isDown) {
            console.log("UP");
            this.setVelocityY(100);
            this.play("walk-up");
        } else if (this.controls.down.isDown) {
            console.log("DOWN");
            this.setVelocityY(-100);
            this.play("walk-down");
        } else if (this.controls.right.isDown) {
            console.log("RIGHT");
            this.setVelocityX(100);
            this.play("walk-right");
        } else if (this.controls.left.isDown) {
            console.log("LEFT");
            this.setVelocityX(-100);
            this.play("walk-left");
        } else {
            console.log("IDLE");
            this.setVelocityX(0);
            this.setVelocityY(0);
            this.play("idle");
        }
    }
}

export class Player extends PlayerControlledSprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerSprite');
    }

    update() {
        
    }
}

export class Mouse extends PlayerControlledSprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mouseSprite');
    }

    update() {
        
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

    }
}

export class Monster extends RemoteControlledSprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'monsterSprite');
    }

    update() {

    }
}