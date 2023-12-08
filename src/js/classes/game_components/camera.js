//view a canvas with zoom and pan
class Camera {
    zoom = 1;
    x = 0;
    y = 0;

    constructor(source, width = 100, height = 100) {
        this.source = source;
        this.sourceCtx = source.getContext('2d');
        this.view = document.createElement('canvas');
        this.ctx = this.view.getContext('2d');
        this.view.width = width;
        this.view.height = height;
        this.update();
    }

    update() {
        const scaledSize = this.scaledSize();
        const scaledWidth = scaledSize.width * this.zoom;
        const scaledHeight = scaledSize.height * this.zoom;

        const x = this.x - (scaledWidth - this.view.width) / 2;
        const y = this.y - (scaledHeight - this.view.height) / 2;

        this.ctx.clearRect(0, 0, this.view.width, this.view.height);
        
        this.ctx.drawImage(this.source, x, y, scaledWidth, scaledHeight);
    }

    scaledSize() {
        const thisRatio = this.view.width / this.view.height;
        const sourceRatio = this.source.width / this.source.height;

        if (thisRatio > sourceRatio) {
            return {
                width: this.source.width * this.view.height / this.source.height,
                height: this.view.height
            }
        } else {
            return {
                width: this.view.width,
                height: this.source.height * this.view.width / this.source.width
            }
        }
    }

    setZoom(zoom) {
        this.zoom = zoom;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    changeZoom(zoom) {
        if (Math.abs(zoom)*1000 < 0.1) return;
        const xratio = this.x / this.source.width;
        const yratio = this.y / this.source.height;
        this.zoom += this.zoom * zoom;
        this.x = xratio * this.source.width;
        this.y = yratio * this.source.height;
    }

    move(x, y) {
        console.log(this.x, this.y);
        const scaledSize = this.scaledSize();
        const scaledWidth = scaledSize.width * this.zoom;
        const scaledHeight = scaledSize.height * this.zoom;

        if (x < 0) {
            console.log(this.x + x + scaledWidth / 2 > 0);
            if (this.x + x + scaledWidth / 2 > 0) {
                console.log('here');
                this.x += x;
            }
        } else {
            console.log(this.x + x - scaledWidth / 2 < 0);
            if (this.x + x - scaledWidth / 2 < 0) {
                console.log('here');
                this.x += x;
            }
        }

        if (y < 0) {
            if (this.y + y + scaledHeight / 2 > 0) {
                this.y += y;
            }
        } else {
            if (this.y + y - scaledHeight / 2 < 0) {
                this.y += y;
            }
        }
    }

    resize(width, height) {
        this.view.width = width;
        this.view.height = height;
    }

    viewToSource(x, y) {
        const scaledSize = this.scaledSize();
        const scaledWidth = scaledSize.width * this.zoom;
        const scaledHeight = scaledSize.height * this.zoom;

        const sourceX = this.x - (scaledWidth - this.view.width) / 2;
        const sourceY = this.y - (scaledHeight - this.view.height) / 2;

        return {
            x: (x - sourceX) * this.source.width / scaledWidth,
            y: (y - sourceY) * this.source.height / scaledHeight
        }
    }
}

module.exports = Camera;