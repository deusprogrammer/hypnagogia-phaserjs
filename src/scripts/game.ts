import 'phaser';
import ErrorScene from './scenes/errorScene';
import CycleScene from './scenes/cycleScene';
import PreloadScene from './scenes/preloadScene';
import StartScene from './scenes/startScene';
import DayToNightScene from './scenes/dayToNightScene';
import NightToDayScene from './scenes/nightToDayScene';
import UIScene from './scenes/uiScene';

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
    scene: [PreloadScene, CycleScene, ErrorScene, StartScene, DayToNightScene, NightToDayScene, UIScene],
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
