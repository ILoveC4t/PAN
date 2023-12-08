class UI {
    _tools = {}

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
        let i = 0;
        for (const color of Object.keys(this.game.pixelArt.colorPalette)) {
            const colorButton = document.createElement('a');
            colorButton.classList.add('color');
            colorButton.style.backgroundColor = color;
            colorButton.onclick = () => {
                this.selectedColor.style.backgroundColor = color;
                this.selectedColor.innerHTML = colorButton.innerHTML;
                this.game.switchColor(color);
            }
            colorButton.innerHTML = i++;
            this.colorPicker.appendChild(colorButton);
        }
        const firstButton = this.colorPicker.children[0];
        this.selectedColor.style.backgroundColor = firstButton.style.backgroundColor;
        this.selectedColor.innerHTML = firstButton.innerHTML;
        
    }

    _setupTools() {
        for (const tool of Object.values(this.game.tools)) {
            const toolButton = document.createElement('a');
            toolButton.id = tool.name;
            toolButton.classList.add('tool');
            toolButton.onclick = () => {
                this._tools[this.game.selectedTool.name].classList.remove('selected');
                toolButton.classList.add('selected');
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
            this._tools[tool.name] = toolButton;
        }
        this._tools[this.game.selectedTool.name].classList.add('selected');
    }

    update() {
        this.game.camera.resize(this.viewContainer.clientWidth, this.viewContainer.clientHeight);
        for (const tool of Object.values(this.game.tools)) {
            const toolProgress = document.getElementById(tool.name + '-progress');
            toolProgress.style.width = tool.progress + '%';
        }
    }
}

module.exports = UI;