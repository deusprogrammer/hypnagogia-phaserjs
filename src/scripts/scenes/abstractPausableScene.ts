export abstract class AbstractPausableScene extends Phaser.Scene {
    public isPaused;
    
    create() {
       this.isPaused = false;
    }

}