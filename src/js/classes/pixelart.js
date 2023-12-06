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
        this._registerColorPalette();
        this.ready = true;
        this.draw();
        this.registerEvents();

        setInterval(() => {
            this.logic();
        }, 1000 / 60);
    }

    finishLoad() {
        this._extract_pixels();
        this._scanColorPalette();
        this._registerColorPalette();
        this.ready = true;
        this.draw();
        this.registerEvents();
    }

    get largestDimension() {
        const imageRatio = this.image.width / this.image.height;
        const canvasRatio = this.canvas.width / this.canvas.height;
        if (imageRatio > canvasRatio) {
            return this.canvas.width;
        } else {
            return this.canvas.height;
        }
    }

    get pixelSize() {
        return this.largestDimension / this.pixels.length * this.camera.zoom;
    }

    get imageSize() {
        const imageWidth = this.pixels[0].length * this.pixelSize;
        const imageHeight = this.pixels.length * this.pixelSize;

        return {
            width: imageWidth,
            height: imageHeight
        }
    }

    get xOffset() {
        return (this.canvas.width - this.imageSize.width) / 2 + this.camera.x;
    }

    get yOffset() {
        return (this.canvas.height - this.imageSize.height) / 2 - this.camera.y;
    }

    draw() {
        if (!this.ready) return;

        const ctx = this.ctx;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const pixelSize = this.pixelSize;
        const xOffset = this.xOffset;
        const yOffset = this.yOffset;

        for (let y = 0; y < this.pixels.length; y++) {
            for (let x = 0; x < this.pixels[y].length; x++) {
                const pixel = this.pixels[y][x];
                const targetX = x * pixelSize + xOffset;
                const targetY = y * pixelSize + yOffset;

                if (targetX < -pixelSize || targetX > this.canvas.width) continue;
                if (targetY < -pixelSize || targetY > this.canvas.height) continue;

                if (!pixel.active) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(targetX, targetY, pixelSize, pixelSize);
                    ctx.fillStyle = "black";
                    ctx.font = `${this.pixelSize*0.5}px Arial`;
                    ctx.fillText(pixel.colorID, targetX + pixelSize / 2, targetY + pixelSize / 2);
                    ctx.fillStyle = "white";
                    continue;
                }
                ctx.fillStyle = pixel.elementString;
                ctx.fillRect(targetX, targetY, pixelSize, pixelSize);
            }
        }
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
        if (this.camera.zoom + zoomOffset < 0.7) {
            this.camera.zoom = 0.7
            return
        }
        this.camera.zoom += zoomOffset;
    }

    mouseWheelEvnt(event) {
        const zoomOffset = event.deltaY / 1000;
        this.chngZoom(zoomOffset);
    }

    mouseMoveEvnt(event) {
        this.mousePos = this._get_mouse_pos(event);
        if (this.mouseDown) {
            const mousePos = this._mouse_pos_to_pixel(this.mousePos);
            if (mousePos.y < 0 || mousePos.y >= this.pixels.length) return;
            if (mousePos.x < 0 || mousePos.x >= this.pixels[0].length) return;
            const pixel = this.pixels[mousePos.y][mousePos.x];
            const pixelColorID = pixel.colorID;
            const colorID = this.colorMap[this.selectedColor];
            if (pixelColorID != colorID) return;
            console.log(pixelColorID, colorID)
            pixel.active = true;
            this.pixels[mousePos.y][mousePos.x] = pixel;
            this._save_data();
        }
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
        for (const key in this.pressedKeys) {
            if (this.pressedKeys[key]) {
                const step = this.camera.moveOffset * 25;
                switch (key) {
                    case "s":
                        if (this.yOffset + this.imageSize.height - step <= 0) break
                        this.move(0, this.camera.moveOffset);
                        break;
                    case "w":
                        if (this.yOffset - this.canvas.height + step >= 0) break
                        this.move(0, -this.camera.moveOffset);
                        break;
                    case "d":
                        if (this.xOffset + this.imageSize.width - step <= 0) break
                        this.move(-this.camera.moveOffset, 0);
                        break;
                    case "a":
                        if (this.xOffset - this.canvas.width + step >= 0) break
                        this.move(this.camera.moveOffset, 0);
                        break;
                }
            }
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
        console.log(this.saveData)
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

    _get_mouse_pos(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return {
            x: x,
            y: y
        }
    }

    _mouse_pos_to_pixel(pos) {
        //get corresponding pixel from array
        const x = Math.floor((pos.x - this.xOffset) / this.pixelSize);
        const y = Math.floor((pos.y - this.yOffset) / this.pixelSize);

        return {
            x: x,
            y: y
        }
    }
}

module.exports = PixelArt;