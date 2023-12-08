class SaveData {
    data = {}

    constructor(worldID, levelID) {
        this.worldID = worldID;
        this.levelID = levelID;
        this.load();
    }

    get pixels() {
        return this.data.pixels;
    }

    set pixels(pixels) {
        this.data.pixels = pixels;
    }

    get colorPalette() {
        return this.data.colorPalette;
    }

    set colorPalette(colorPalette) {
        this.data.colorPalette = colorPalette;
    }

    get score() {
        return this.data.score;
    }

    set score(score) {
        this.data.score = score;
    }

    load() {
        const saveData = localStorage.getItem('saveData');
        if (!saveData) return;
        const data = JSON.parse(saveData);
        if (!data[this.worldID]) data[this.worldID] = {};
        if (!data[this.worldID][this.levelID]) data[this.worldID][this.levelID] = {};
        this.data = data[this.worldID][this.levelID];
    }

    save() {
        const saveData = localStorage.getItem('saveData');
        if (!saveData) return;
        const data = JSON.parse(saveData);
        if (!data[this.worldID]) data[this.worldID] = {};
        data[this.worldID][this.levelID] = this.data;
        localStorage.setItem('saveData', JSON.stringify(data));
    }
}

module.exports = SaveData