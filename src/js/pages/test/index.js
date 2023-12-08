const PixelArt = require('../../classes/game_components/pixelart.js')
const Camera = require('../../classes/game_components/camera.js')

const img = new Image()
img.src = 'assets/worlds/0/test.png'

const pixelArt = new PixelArt(img)
const camera = new Camera(pixelArt.canvas, window.innerWidth * 0.9, window.innerHeight * 0.9)

document.body.appendChild(camera.view)

setInterval(() => {
    camera.update()
}, 1000 / 60)

document.body.onkeydown = (e) => {
    if (e.key == 'ArrowLeft') {
        camera.setPos(camera.x - 10, camera.y)
    } else if (e.key == 'ArrowRight') {
        camera.setPos(camera.x + 10, camera.y)
    } else if (e.key == 'ArrowUp') {
        camera.setPos(camera.x, camera.y - 10)
    } else if (e.key == 'ArrowDown') {
        camera.setPos(camera.x, camera.y + 10)
    } else if (e.key == 'a') {
        camera.setZoom(camera.zoom - 0.1)
    } else if (e.key == 's') {
        camera.setZoom(camera.zoom + 0.1)
    }
}