import { AbstractSprite } from "../objects/sprites";

export let createPlayerAnimation = (sprite: AbstractSprite, texture: string, framesPerAnimation: number) => {
    sprite.anims.create({
        key: 'walk-down',
        frames: sprite.anims.generateFrameNumbers(texture, { start: 0, end: framesPerAnimation - 1 }),
        frameRate: 10,
        repeat: 1
    });
    sprite.anims.create({
        key: 'walk-left',
        frames: sprite.anims.generateFrameNumbers(texture, { start: framesPerAnimation * 1, end: framesPerAnimation * 2 - 1 }),
        frameRate: 10,
        repeat: 1
    });
    sprite.anims.create({
        key: 'walk-right',
        frames: sprite.anims.generateFrameNumbers(texture, { start: framesPerAnimation * 2, end: framesPerAnimation * 3 - 1}),
        frameRate: 10,
        repeat: 1
    });
    sprite.anims.create({
        key: 'walk-up',
        frames: sprite.anims.generateFrameNumbers(texture, { start: framesPerAnimation * 3, end: framesPerAnimation * 4 - 1}),
        frameRate: 10,
        repeat: 1
    });
    sprite.anims.create({
        key: 'idle-down',
        frames: sprite.anims.generateFrameNumbers(texture, { start: 0, end: 0}),
        frameRate: 10,
        repeat: 1
    });
    sprite.anims.create({
        key: 'idle-left',
        frames: sprite.anims.generateFrameNumbers(texture, { start: 3, end: 3}),
        frameRate: 10,
        repeat: 1
    });
    sprite.anims.create({
        key: 'idle-right',
        frames: sprite.anims.generateFrameNumbers(texture, { start: 6, end: 6}),
        frameRate: 10,
        repeat: 1
    });
    sprite.anims.create({
        key: 'idle-up',
        frames: sprite.anims.generateFrameNumbers(texture, { start: 9, end: 9}),
        frameRate: 10,
        repeat: 1
    });
}