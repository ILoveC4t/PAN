const Camera = require("./game_components/camera.js");
const PixelArt = require("./game_components/pixelart.js");
const InputTracker = require("./game_components/inputtracker.js");
const UI = require("./game_components/ui.js");
const SaveData = require("./game_components/savedata.js");
const { Pen, Brush, Bucket, Eraser } = require("./game_components/tool.js");

class Game {
    inputOptions = {
        mouse: true,
        keys: ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
    }

    tools = {
        pen: new Pen(this),
        brush: new Brush(this),
        bucket: new Bucket(this),
        eraser: new Eraser(this)
    }
    selectedTool = this.tools.pen;
    selectedColor = '#000000';
    
    score = {
        points: 0,
        maxPoints: 250
    }

    constructor(img, worldId, levelId) {
        this.saveData = new SaveData(worldId, levelId);
        this.pixelArt = new PixelArt(img);
        this.camera = new Camera(this.pixelArt.canvas);
        this.camera.setZoom(2)
        this.inputTracker = new InputTracker(this.inputOptions, this.camera.view);
        this.ui = new UI(this);
        setInterval(() => {
            this.update();
        }, 1000 / 60);
    }

    update() {
        this.ui.update();
        this.camera.update();
        this.inputHandling();
    }

    inputHandling() {
        const mvSize = 10;
        for (const [key, isPressed] of Object.entries(this.inputTracker.keys)) {
            if (!isPressed) continue;
            switch (key) {
                case 'w':
                case 'ArrowUp':
                    this.camera.move(0, mvSize);
                    break;
                case 'a':
                case 'ArrowLeft':
                    this.camera.move(mvSize, 0);
                    break;
                case 's':
                case 'ArrowDown':
                    this.camera.move(0, -1 * mvSize);
                    break;
                case 'd':
                case 'ArrowRight':
                    this.camera.move(-1 * mvSize, 0);
                    break;
                default:
                    break;
            }
        }
        if (this.inputTracker.mouse.left) {
            this.selectedTool.action();

        }
        if (this.inputTracker.mouse.scroll != 0) this.camera.changeZoom(this.inputTracker.mouse.scroll/1000);
    }
}

module.exports = Game;