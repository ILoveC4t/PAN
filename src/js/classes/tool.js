class Tool {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.element = document.getElementById(name);
        this.element.onclick = this.onclick.bind(this);
        this.progressElement = this.element.children[1];
    }
    
    use() {
        console.log("Using tool: " + this.name);
        this.game.selectedTool = this;
    }

    onclick() {
        this.use();
    }
}

class Pen extends Tool {
    constructor(game) {
        super(game, "pen");
    }
}

class Brush extends Tool {
    constructor(game) {
        super(game, "brush");
    }
}

class Eraser extends Tool {
    constructor(game) {
        super(game, "eraser");
    }
}

class Bucket extends Tool {
    constructor(game) {
        super(game, "fill");
    }
}

module.exports = {
    Pen: Pen,
    Brush: Brush,
    Eraser: Eraser,
    Bucket: Bucket,
}
