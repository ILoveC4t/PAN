class Pixel {
    active = false;
    colorID = 0;
    pixels = []

    constructor(hex, colorID) {
        this.hex = hex;
        this.rgb = Pixel.hexToRgb(hex);
        this.cssColor = `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
        this.colorID = colorID;
    }

    static hexToRgb(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        return { r, g, b };
    }

    static rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}

module.exports = Pixel