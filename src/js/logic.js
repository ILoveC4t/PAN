const PixelArt = require("./classes/pixelart.js");

function main() {
    const canvas = document.getElementById("image");
    const image = new PixelArt(canvas, "images/image.png");
}

window.main = main;