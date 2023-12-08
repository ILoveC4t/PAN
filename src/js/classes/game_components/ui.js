class UI {

    constructor(game) {
        this.game = game;
        this.viewContainer = document.getElementById("view-container");
        this.colorPicker = document.getElementById("color-picker");
        this.selectedColor = document.getElementById("selected-color");
        this.toolbox = document.getElementById("toolbox");
        this._setupCameraView();
        this._setupColorPallete();
        this._setupTools();
    }

    _setupCameraView() {
        this.viewContainer.appendChild(this.game.camera.view);
    }

    _setupColorPallete() {
        for (const color of Object.keys(this.game.pixelArt.colorPalette)) {
            const colorButton = document.createElement('a');
            colorButton.classList.add('color');
            colorButton.style.backgroundColor = color;
            colorButton.onclick = () => {
                this.game.switchColor(color);
            }
            this.colorPicker.appendChild(colorButton);
        }
    }

    _setupTools() {
        for (const tool of Object.values(this.game.tools)) {
            const toolButton = document.createElement('a');
            toolButton.id = tool.name;
            toolButton.classList.add('tool');
            toolButton.onclick = () => {
                this.game.switchTool(tool.name);
            }

            const toolImg = document.createElement('img');
            toolImg.classList.add('tool-img');
            toolImg.src = tool.img;
            toolButton.appendChild(toolImg);

            const toolProgress = document.createElement('a');
            toolProgress.classList.add('tool-progress');
            toolProgress.id = tool.name + '-progress';
            toolProgress.style.width = '0%';
            toolButton.appendChild(toolProgress);

            this.toolbox.appendChild(toolButton);
        }
    }

    update() {
        this.game.camera.resize(this.viewContainer.clientWidth, this.viewContainer.clientHeight);
        this.selectedColor.style.backgroundColor = this.game.selectedColor;
        for (const tool of Object.values(this.game.tools)) {
            const toolProgress = document.getElementById(tool.name + '-progress');
            toolProgress.style.width = tool.progress + '%';
        }
    }
}

module.exports = UI;