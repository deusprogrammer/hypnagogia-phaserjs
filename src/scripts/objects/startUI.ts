import 'phaser'

export class StartUI {
    panel;
    headerText;
    buttonLightScene;
    buttonLightSceneText;
    buttonDarkScene;
    buttonDarkSceneText;
    buttonStartScene;
    buttonStartSceneText;
    elements;

    constructor(scene, x, y)
    {
        this.elements = new Set();
        this.panel = scene.add.image(x, y, 'panel');
        this.elements.add(this.panel);
        this.headerText = scene.add.text(x - 100, y - 145, 'What is up, mah dudes', { fontSize: '16px', color: '#000', backgroundColor: '#eeeeee'});
        this.elements.add(this.headerText);
        this.buttonLightScene = scene.add.image(x, y - 50, 'button').setInteractive();
        this.elements.add(this.buttonLightScene);
        this.buttonLightSceneText = scene.add.text(this.buttonLightScene.x - 30, this.buttonLightScene.y - 8, 'Light Scene', {fontSize: '10px', color:'#eeeeee'});
        this.elements.add(this.buttonLightSceneText);
        this.buttonDarkScene = scene.add.image(x, y + 30, 'button').setInteractive();
        this.elements.add(this.buttonDarkScene);
        this.buttonDarkSceneText = scene.add.text(this.buttonDarkScene.x - 30, this.buttonDarkScene.y - 8, 'Dark Scene', {fontSize: '10px', color:'#eeeeee'});
        this.elements.add(this.buttonDarkSceneText);
        this.buttonStartScene = scene.add.image(x, y + 110, 'button').setInteractive();
        this.elements.add(this.buttonStartScene);
        this.buttonStartSceneText = scene.add.text(this.buttonStartScene.x - 30, this.buttonStartScene.y - 8, 'Start Scene', {fontSize: '10px', color:'#eeeeee'});
        this.elements.add(this.buttonStartSceneText);


        this.buttonLightScene.on('pointerdown', function ()
        {
            console.log("button1");
            scene.scene.start('DayCycleScene');
        })

        this.buttonDarkScene.on('pointerdown', function()
        {
            console.log("button2");
            scene.scene.start('NightCycleScene');
        })

        this.buttonStartScene.on('pointerdown', function()
        {
            console.log("button3");
            scene.scene.start('StartScene');
        })
    }

    disableUI()
    {
        let elementsArray = Array.from<any>(this.elements);
        elementsArray.forEach((element)=>{element.destroy()})
    };


}