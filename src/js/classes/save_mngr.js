const RGBQuant = require('rgbquant');

class DataMngr {
    sizes = {
        small: {
            colors: 12,
            maxSide: 64
        },
        medium: {
            colors: 16,
            maxSide: 128
        },
        large: {
            colors: 32,
            maxSide: 256
        },
        xlarge: {
            colors: 48,
            maxSide: 512
        },
    }

    lastDel = 0;
    get imgAmount() {
        return Object.keys(this.data).length;
    }

    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        let data = localStorage.getItem('customImages');
        if (!data) return {}
        return JSON.parse(data);
    }

    saveData() {
        localStorage.setItem('customImages', JSON.stringify(this.data));
    }

    /*
    * @param {String} name
    * @param {HTMLCanvasElement|HTMLImageElement|String} img
    * @return {Number} id
    */
    addImg(name, img, size) {
        const id = this.imgAmount;
        const can = document.createElement('canvas')
        const ctx = can.getContext('2d')
        const sizeData = this.sizes[size];
        console.log(sizeData)
        const quant = new RGBQuant({
            colors: sizeData.colors,
        });
        switch (img.constructor.name) {
            case 'HTMLImageElement':
                let width  = sizeData.maxSide;
                let height = width
                if (img.width > img.height) {
                    height = Math.round(img.height * sizeData.maxSide / img.width);
                } else {
                    width = Math.round(img.width * sizeData.maxSide / img.height);
                }
                can.width = width;
                can.height = height;
                const ctx = can.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                break;
            case 'HTMLCanvasElement':
                console.log("Converting canvas")
                img = new Image();
                img.src = img.toDataURL();
                img.onload = () => {
                    return id;
                }
                break;
            case 'String':
                console.log("Converting string")
                img = new Image();
                img.src = img;
                img.onload = () => {
                    const id = this.addImg(name, img);
                    return id;
                }
                break;
            default:
                console.error('img is not canvas, html img or base64 str');
                return;
        }
        const oldImgData = ctx.getImageData(0, 0, can.width, can.height);
        quant.sample(oldImgData);
        const rawData = quant.reduce(oldImgData);
        const out = new ImageData(new Uint8ClampedArray(rawData), can.width, can.height);
        ctx.putImageData(out, 0, 0);
        const imgData = can.toDataURL();
        this.data[id] = {
            name: name,
            imgData: imgData
        }
        this.saveData();
        return id;
    }

    /*
    * @param {Number} id
    * @return {Object} {name: String, img: HTMLImageElement}
    */
    getImg(id) {
        const data = this.data[id];
        if (!data) return null;
        const img = new Image();
        img.src = data.imgData;
        return {
            name: data.name,
            img: img
        }
    }

    delImg(id) {
        const progressData = JSON.parse(localStorage.getItem('savedata'));
        if (progressData && progressData.custom && progressData.custom[id]) {
            delete progressData.custom[id];
            localStorage.setItem('savedata', JSON.stringify(progressData));
        }
        delete this.data[id];
        this.saveData();
    }

    reset() {
        this.data = {};
        this.saveData();
    }
}

module.exports = DataMngr;