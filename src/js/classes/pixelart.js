class Pixel {
    active = false;
    colorID = 0;

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.elementString = `rgb(${r}, ${g}, ${b})`;
    }

    stringToColor(string) {
        const r = parseInt(string.split(",")[0].split("(")[1]);
        const g = parseInt(string.split(",")[1]);
        const b = parseInt(string.split(",")[2].split(")")[0]);
        return {
            r: r,
            g: g,
            b: b
        }
    }

    colorMatch(r, g, b) {
        if (this.r == r && this.g == g && this.b == b) {
            return true;
        } else {
            return false;
        }
    }
}

class PixelArt {
    unsavedPixels = 0;
    sizeModifier= 25
    pixels = [];
    camera = {
        x: 0,
        y: 0,
        zoom: 1,
        moveOffset: 10
    }

    mouseDown = false;
    mousePos = {
        x: 0,
        y: 0
    }

    pressedKeys = {
        w: false,
        a: false,
        s: false,
        d: false
    }

    colorPalette = null;
    colorMap = {};

    constructor(canvas, img, worldId, levelId) {
        this.worldId = worldId;
        this.levelId = levelId;
        this.ready = false;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d", {
            alpha: false,
            desynchronized: true,
            preserveDrawingBuffer: true
        });
        this.resizeCanvas();
        this.colorSelector = document.getElementById("color-selector");
        this.image = img;
        this.src = img.src
        this._extract_pixels();
        this._load_save_data();
        this._scanColorPalette();
        this._prepBuffer();
        this._registerColorPalette();
        this.ready = true;
        this.draw();
        this.registerEvents();

        setInterval(() => {
            this.logic();
        }, 1000 / 60);
    }

    get largestDimension() {
        const imageRatio = this.image.width / this.image.height;
        const canvasRatio = this.canvas.width / this.canvas.height;
        if (imageRatio > canvasRatio) {
            return {
                width: this.canvas.width,
                height: this.canvas.width / imageRatio
            }
        } else {
            return {
                width: this.canvas.height * imageRatio,
                height: this.canvas.height
            }
        }
    }

    get imageSize() {
        const largestDimension = this.largestDimension;
        return {
            width: largestDimension.width * this.camera.zoom,
            height: largestDimension.height * this.camera.zoom
        }
    }

    get xOffset() {
        return this.camera.x + this.canvas.width / 2 - this.imageSize.width / 2;
    }

    get yOffset() {
        return this.camera.y + this.canvas.height / 2 - this.imageSize.height / 2;
    }

    get pixelSize() {
        return this.sizeModifier * this.camera.zoom;
    }

    draw() {
        if (!this.ready) return;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.buffer, this.xOffset, this.yOffset, this.imageSize.width, this.imageSize.height);
    }

    logic() {
        this.draw();
        this.mvUpdate();
    }

    move(xOffset, yOffset) {
        this.camera.x += xOffset;
        this.camera.y += yOffset;
    }

    chngZoom(zoomOffset) {
        const xratio = this.camera.x / this.imageSize.width;
        const yratio = this.camera.y / this.imageSize.height;
        if (this.camera.zoom + zoomOffset < 0.7) {
            this.camera.zoom = 0.7
            return
        }
        this.camera.zoom += zoomOffset;
        this.camera.x = xratio * this.imageSize.width;
        this.camera.y = yratio * this.imageSize.height;
    }

    mouseWheelEvnt(event) {
        let zoomOffset = event.deltaY / 1000;
        zoomOffset = zoomOffset * this.camera.zoom;
        this.chngZoom(zoomOffset);
    }

    mouseDownEvnt() {
        this.mouseDown = true;
    }

    mouseUpEvnt() {
        this.mouseDown = false;
    }

    keyDownEvnt(key) {
        if (key in this.pressedKeys) {
            this.pressedKeys[key] = true;
        }
    }

    keyUpEvnt(key) {
        if (key in this.pressedKeys) {
            this.pressedKeys[key] = false;
        }
    }

    resizeCanvas() {
        const canvasContainer = document.getElementById("canvas-container");
        this.canvas.width = canvasContainer.clientWidth;
        this.canvas.height = canvasContainer.clientHeight;
    }

    registerEvents() {
        window.addEventListener("keydown", (event) => {
            this.keyDownEvnt(event.key);
        });
        window.addEventListener("keyup", (event) => {
            this.keyUpEvnt(event.key);
        });
        window.addEventListener("wheel", (event) => {
            this.mouseWheelEvnt(event);
        });
        this.canvas.addEventListener("mousedown", () => {
            this.mouseDownEvnt();
        });
        this.canvas.addEventListener("mouseup", () => {
            this.mouseUpEvnt();
        });
        this.canvas.addEventListener("mousemove", (event) => {
            this.mouseMoveEvnt(event);
        });
        window.addEventListener("resize", () => {
            this.resizeCanvas();
        });
    }

    mvUpdate() {
        const step = this.camera.moveOffset * this.camera.zoom;
        for (const key in this.pressedKeys) {
            if (this.pressedKeys[key]) {
                switch (key) {
                    case "s":
                        if (this.camera.y - this.camera.moveOffset < -this.imageSize.height/2) break;
                        this.move(0, -this.camera.moveOffset);
                        break;
                    case "w":
                        if (this.camera.y + this.camera.moveOffset > this.imageSize.height/2) break;
                        this.move(0, this.camera.moveOffset);
                        break;
                    case "d":
                        if (this.camera.x - this.camera.moveOffset < -this.imageSize.width/2) break;
                        this.move(-this.camera.moveOffset, 0);
                        break;
                    case "a":
                        if (this.camera.x + this.camera.moveOffset > this.imageSize.width/2) break;
                        this.move(this.camera.moveOffset, 0);
                        break;
                }
            }
        }
    }

    _prepBuffer() {
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.image.width*this.sizeModifier;
        this.buffer.height = this.image.height*this.sizeModifier;
        this.bufferCtx = this.buffer.getContext("2d");
        for (let y = 0; y < this.pixels.length; y++) {
            for (let x = 0; x < this.pixels[y].length; x++) {
                const pixel = this.pixels[y][x];
                this._setBufferPixel(x, y, pixel);
            }
        }
    }

    _setBufferPixel(x, y, pixel) {
        const color = pixel.elementString;
        this.bufferCtx.fillStyle = color;
        if (pixel.active) {
            this.bufferCtx.fillRect(x*this.sizeModifier, y*this.sizeModifier, this.sizeModifier, this.sizeModifier);
        } else {
            this.bufferCtx.fillStyle = "white";
            this.bufferCtx.fillRect(x*this.sizeModifier, y*this.sizeModifier, this.sizeModifier, this.sizeModifier);
            this.bufferCtx.fillStyle = "black";
            this.bufferCtx.textAlign = "center";
            this.bufferCtx.textBaseline = "middle";
            this.bufferCtx.font = this.sizeModifier*0.8 + "px Arial";
            this.bufferCtx.fillText(pixel.colorID, x*this.sizeModifier+this.sizeModifier/2, y*this.sizeModifier+this.sizeModifier/2);
        }
    }

    _scanColorPalette() {
        if (this.colorPalette != null) {
            for (const color of this.colorPalette) {
                this.colorMap[color] = this.colorPalette.indexOf(color);
            }
        }
        for (let y = 0; y < this.pixels.length; y++) {
            for (let x = 0; x < this.pixels[y].length; x++) {
                const pixel = this.pixels[y][x];
                const color = pixel.elementString;
                let colorID = this.colorMap[color];
                if (colorID == undefined) {
                    this.colorPalette = this.colorPalette || [];
                    this.colorPalette.push(color);
                    this.colorMap[color] = this.colorPalette.indexOf(color);
                    colorID = this.colorMap[color];
                }                
                pixel.colorID = colorID;
            }
        }
    }

    _registerColorPalette() {
        const uglyHack = {
            12: 4,
            16: 4,
            32: 4,
            48: 5
        }
        const colorAmnt = this.colorPalette.length;
        const colorsPerRow = uglyHack[colorAmnt];
        const colorSelectorWidth = this.colorSelector.clientWidth;
        const windowWidth = window.innerWidth;
        const vw = (colorSelectorWidth / colorsPerRow / windowWidth * 100)*0.8;
        for (const color of this.colorPalette) {
            const colorDiv = document.createElement("div");
            colorDiv.classList.add("color-square");
            colorDiv.style.backgroundColor = color;
            colorDiv.style.width = `${vw}vw`;
            colorDiv.style.height = `${vw}vw`;
            const colorID = this.colorMap[color];
            colorDiv.innerHTML = colorID;
            colorDiv.addEventListener("click", () => {
                this.selectedColor = color;
            });
            this.colorSelector.appendChild(colorDiv);
        }
    }

    _extract_pixels() {
        const width = this.image.width;
        const height = this.image.height;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(this.image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const pixels = [];
        for (let y = 0; y < height; y++) {
            pixels.push([]);
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                pixels[y].push(new Pixel(r, g, b));
            }
        }
        this.pixels = pixels;
    }

    _save_data() {
        const activePixels = [];
        for (let y = 0; y < this.pixels.length; y++) {
            for (let x = 0; x < this.pixels[y].length; x++) {
                const pixel = this.pixels[y][x];
                if (pixel.active) {
                    activePixels.push({
                        x: x,
                        y: y
                    });
                }
            }
        }
        this.saveData = this.saveData || {};
        this.saveData[this.worldId] = this.saveData[this.worldId] || {};
        const imageData = {
            pixels: activePixels,
            colorPalette: this.colorPalette
        }
        this.saveData[this.worldId][this.levelId] = imageData;
        localStorage.setItem("savedata", JSON.stringify(this.saveData));
    }

    _load_save_data() {
        const saveData = localStorage.getItem("savedata");
        if (!saveData) return {};
        this.saveData= JSON.parse(saveData);
        if (!this.saveData[this.worldId]) return;
        const imageData = this.saveData[this.worldId][this.levelId];
        if (!imageData) return;
        for (const pixel of imageData.pixels) {
            this.pixels[pixel.y][pixel.x].active = true;
        }
        this.colorPalette = imageData.colorPalette;
    }

    mouseMoveEvnt(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixelSize = this.imageSize.width / this.pixels[0].length;
        const pixelX = Math.floor((x - this.xOffset) / pixelSize);
        const pixelY = Math.floor((y - this.yOffset) / pixelSize);
        if (pixelX < 0 || pixelY < 0 || pixelX >= this.pixels[0].length || pixelY >= this.pixels.length) return;
        const pixel = this.pixels[pixelY][pixelX];
        if (!this.mouseDown || pixel.active || pixel.colorID != this.colorMap[this.selectedColor]) return;
        pixel.active = true;
        this.unsavedPixels++;
        this._setBufferPixel(pixelX, pixelY, pixel);
        if (this.unsavedPixels > 10) {
            this._save_data();
            this.unsavedPixels = 0;
        }
    }
}

module.exports = PixelArt;