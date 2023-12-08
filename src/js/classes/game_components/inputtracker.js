class InputTracker {
    mouse = {
        x: 0,
        y: 0,
        scroll: 0,
        left: false,
        right: false,
        middle: false
    }

    keys = {}

    constructor(opts, element = document.body) {
        this.element = element;
        this._parseOpts(opts);
        window.addEventListener('keydown', this._keyDown.bind(this));
        window.addEventListener('keyup', this._keyUp.bind(this));
    }

    _parseOpts(opts) {
        if (!opts) return;
        if (opts.mouse) {
            this.element.addEventListener('mousemove', this._mouseMove.bind(this));
            this.element.addEventListener('mousedown', this._mouseDown.bind(this));
            this.element.addEventListener('mouseup', this._mouseUp.bind(this));
            this.element.addEventListener('wheel', this._mouseWheel.bind(this));
        }
        if (opts.keys) {
            for (let i = 0; i < opts.keys.length; i++) {
                this.keys[opts.keys[i]] = false;
            }
        }
    }

    _mouseMove(e) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
    }

    _mouseDown(e) {
        switch (e.button) {
            case 0:
                this.mouse.left = true;
                break;
            case 1:
                this.mouse.middle = true;
                break;
            case 2:
                this.mouse.right = true;
                break;
        }
    }

    _mouseUp(e) {
        switch (e.button) {
            case 0:
                this.mouse.left = false;
                break;
            case 1:
                this.mouse.middle = false;
                break;
            case 2:
                this.mouse.right = false;
                break;
        }
    }

    _mouseWheel(e) {
        this.mouse.scroll = e.deltaY;
        if (Math.abs(this.mouse.scroll) <= 1) this.mouse.scroll = 0;
    }

    _keyDown(e) {
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
    }

    _keyUp(e) {
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
    }
}

module.exports = InputTracker;