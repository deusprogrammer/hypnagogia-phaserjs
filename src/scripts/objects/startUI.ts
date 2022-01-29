import 'phaser'

export class StartUI {
    text;
    panel;
    button1;
    button2;

    constructor(scene, x, y)
    {
        this.panel = scene.add.image(x, y, 'panel');
        this.text = scene.add.text(x-100, y - 170, 'What is up, mah dudes', { fontSize: '16px', color: '#000'});
        this.button1 = scene.add.image(x, y-50, 'button').setInteractive();
        this.button2 = scene.add.image(x, y+50, 'button').setInteractive();

        this.button1.on('pointerdown', function ()
        {
            console.log("button1");
            scene.scene.start('DayCycleScene');
        });

        this.button2.on('pointerdown', function()
        {
            console.log("button2");
            scene.scene.start('NightCycleScene');
        })
    }


}