const Pixel = require('./pixel.js')

class PixelArt {
    _sizeMultiplier = 25
    pixels = []
    _colorAmount = 0
    colorPalette = {}

    constructor(img) {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.img = img
        this._init()
    }

    _init() {
        this.canvas.width = this.img.width * this._sizeMultiplier
        this.canvas.height = this.img.height * this._sizeMultiplier

        this._createPixels()
        this._draw()
    }

    _rawData() {
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = this.img.width
        tempCanvas.height = this.img.height
        tempCtx.drawImage(this.img, 0, 0, tempCanvas.width, tempCanvas.height)
        const rawData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data
        return rawData

    }

    _createPixels() {
        const rawData = this._rawData()
        const pixels = []
        for (let y = 0; y < this.img.height; y++) {
            const row = []
            for (let x = 0; x < this.img.width; x++) {
                const index = (y * this.img.width + x) * 4
                const color = `rgb(${rawData[index]}, ${rawData[index + 1]}, ${rawData[index + 2]})`
                const colorHex = Pixel.rgbToHex(rawData[index], rawData[index + 1], rawData[index + 2])
                const colorID = this._getColorID(colorHex)
                const pixel = new Pixel(color, colorID)
                row.push(pixel)
            }
            pixels.push(row)
        }
        this.pixels = pixels
    }

    _draw() {
        for(let y = 0; y < this.pixels.length; y++) {
            for(let x = 0; x < this.pixels[y].length; x++) {
                this._drawPixel(x, y, this.pixels[y][x])
            }
        }
    }

    _getColorID(color) {
        if (this.colorPalette[color]) {
            return this.colorPalette[color]
        } else {
            this.colorPalette[color] = this._colorAmount
            this._colorAmount++
            return this.colorPalette[color]
        }
    }

    setPixel(x, y, active) {
        const pixel = this.pixels[y][x]
        if (!pixel) return
        pixel.active = active
        this._drawPixel(x, y, pixel)
    }

    _drawPixel(x, y, pixel) {
        console.log(pixel)
        this.ctx.strokeStyle = 'rgb(0, 0, 0)'
        if (pixel.active) {
            this.ctx.fillStyle = pixel.cssColor
            this.ctx.fillRect(x * this._sizeMultiplier, y * this._sizeMultiplier, this._sizeMultiplier, this._sizeMultiplier)
            this.ctx.strokeRect(x * this._sizeMultiplier, y * this._sizeMultiplier, this._sizeMultiplier, this._sizeMultiplier)
        } else {
            this.ctx.fillStyle = 'rgb(255, 255, 255)'
            this.ctx.fillRect(x * this._sizeMultiplier, y * this._sizeMultiplier, this._sizeMultiplier, this._sizeMultiplier)
            this.ctx.strokeRect(x * this._sizeMultiplier, y * this._sizeMultiplier, this._sizeMultiplier, this._sizeMultiplier)
            
            this.ctx.fillStyle = 'rgb(0, 0, 0)'
            this.ctx.font = this._sizeMultiplier / 2 + 'px Arial'
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.fillText(pixel.colorID, x * this._sizeMultiplier + this._sizeMultiplier / 2, y * this._sizeMultiplier + this._sizeMultiplier / 2)
        }
    }

    set sizeMultiplier(value) {
        this._sizeMultiplier = value
        this._init()
    }

    get width() {
        return this.canvas.width
    }

    get height() {
        return this.canvas.height
    }
}

module.exports = PixelArt