const SaveMngr = require('../../classes/save_mngr.js');
const PixelArt = require('../../classes/pixelart.js')

const Searchparams = new URLSearchParams(window.location.search);
const worldId = Searchparams.get('world');
const levelId = Searchparams.get('level');

function load() {
    if (worldId == null || levelId == null) {
        window.location.href = 'index.html';
    } else if (worldId == 'custom') {
        loadCustomWorld(levelId);
    } else {
        loadStdWorld(worldId, levelId);
    }
}

function loadCustomWorld(levelId) {
    const saveMngr = new SaveMngr();
    const img = saveMngr.getImg(levelId);
    if (img == null) {
        window.location.href = 'index.html';
    } else {
        img.img.onload = () => {
            const canvas = document.getElementById('image');
            new PixelArt(canvas, img.img, "custom", levelId)
        }
    }
}

function loadStdWorld(worldId, levelId) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/worlds/' + worldId + '/info.json');
    req.onloadend = () => {
        if (req.status == 200) {
            const world = JSON.parse(req.response);
            const level = world.levels[levelId];
            const img = new Image();
            img.src = 'assets/worlds/' + worldId + '/' + level.img
            img.onload = () => {
                const canvas = document.getElementById('image');
                new PixelArt(canvas, img, worldId, levelId)
            }
        } else {
            console.log(Error(req.statusText));
        }
    }
    req.onerror = () => {
        console.log(Error('Network Error'));
    }
    req.send();
}

function backToMenu() {
    window.location.href = 'index.html';
}

window.onload = function() {
    load();
    document.getElementById('back').onclick = backToMenu;
}