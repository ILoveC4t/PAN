class Tool {
    name = 'tool';
    img = 'assets/tools/pen.png';
    cost = 0;
    constructor(game) {
        this.game = game;
    }

    get progress() {
        if (this.cost == 0) return 0;
        return this.game.score.points / this.cost * 100;
    }

    onActivate() {
        console.log('activating tool: ' + this.name);
    }

    onDeactivate() {
        console.log('deactivating tool: ' + this.name);
    }

    action() {
        console.log('using tool: ' + this.name);
    }
}

class Pen extends Tool {
    name = 'pen';
    img = 'assets/tools/pen.png';
}

class Brush extends Tool {
    cost = 50;
    name = 'brush';
    img = 'assets/tools/brush.png';
}

class Bucket extends Tool {
    cost = 100;
    name = 'bucket';
    img = 'assets/tools/bucket.png';
}

class Eraser extends Tool {
    name = 'eraser';
    img = 'assets/tools/eraser.png';
}

module.exports = { Tool, Pen, Brush, Bucket, Eraser };