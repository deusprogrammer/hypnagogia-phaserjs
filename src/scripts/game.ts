import 'phaser'
import DayCycleScene from './scenes/dayCycleScene'
import NightCycleScene from './scenes/nightCycleScene'
import PreloadScene from './scenes/preloadScene'
import StartScene from './scenes/startScene'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [PreloadScene, DayCycleScene, NightCycleScene, StartScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
})
