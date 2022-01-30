import 'phaser';

export default class UIScene extends Phaser.Scene {
    timerElement : Phaser.GameObjects.Text;
    timeRemaining : number;
    cycle : string;
    timerInterval: NodeJS.Timer;
    onTimeout: () => void;

    constructor() {
        super('UIScene');
    }

    init({timeRemaining, cycle, onTimeout}) {
        this.timeRemaining = timeRemaining;
        this.cycle = cycle;
        this.onTimeout = onTimeout;
    }

    create() {
        // Create timer element
        this.timerElement = this.add.text(50, 50, `You have ${this.timeRemaining}s to find the ${this.cycle === 'day' ? 'cat' : 'door'}`, { fontSize: "20pt", stroke: "#000", strokeThickness: 5 });
        this.timerElement.setOrigin(0, 1);
        this.timerElement.depth = 9999;
        this.timerElement.setScrollFactor(0, 0);
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            if (this.timeRemaining === 0) {
                clearInterval(this.timerInterval);
                this.onTimeout();
            }
            this.timerElement.setText(`You have ${this.timeRemaining}s to find the ${this.cycle === 'day' ? 'cat' : 'door'}`);
        }, 1000);
    }

    update() {

    }
}