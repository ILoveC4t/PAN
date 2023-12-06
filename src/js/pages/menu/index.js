const SaveMngr = require('../../classes/save_mngr.js');
const saveMngr = new SaveMngr();

window.onload = function() {
    window.saveMngr = saveMngr;
    loadLevels();
    loadCustom();
    document.getElementById('saveButton').onclick = save;
}

function save() {
    const name = document.getElementById('imageName').value;
    if (name === '') return alert('Please enter a name');
    if (name.length > 14) return alert('Name must be less than 14 characters');
    
    const form = document.getElementById('fileForm')
    const sizeSelect = document.getElementById('size');
    const size = sizeSelect.options[sizeSelect.selectedIndex].value;
    const file = form.files[0];
    if (!file) return;
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
            saveMngr.addImg(name, img, size);
            loadCustom();
        }
    }
    reader.readAsDataURL(file);
}

function loadWorldInfo(id) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/worlds/' + id + '/info.json');
    return new Promise((resolve, reject) => {
        req.onloadend = () => {
            if (req.status == 200) {
                resolve(JSON.parse(req.response));
            } else {
                reject(Error(req.statusText));
            }
        }
        req.onerror = () => {
            reject(Error('Network Error'));
        }
        try {
            req.send();
        } catch (e) {
            reject(e);
        }
    });
}

async function loadLevels() {
    let id = 0
    const mainMenu = document.getElementById('main-menu');
    const lastNode = mainMenu.childNodes[mainMenu.childNodes.length - 4];

    while(true) {
        try {
            var world = await loadWorldInfo(id)
        }
        catch (e) {
            break;
        }
        if (!world) break;
        const div = document.createElement('div');
        div.className = 'world';
        div.id = 'world' + id;
        
        const worldName = document.createElement('h1');
        worldName.className = 'world-name'
        worldName.innerHTML = world.name;
        div.appendChild(worldName);

        const levels = document.createElement('div');
        levels.className = 'levels';
        div.appendChild(levels);

        for (let i = 0; i < world.levels.length; i++) {
            const level = document.createElement('div');
            level.className = 'level';
            level.id = 'level' + i;
            levels.appendChild(level);

            const levelName = document.createElement('h2');
            levelName.className = 'level-name';
            levelName.innerHTML = await world.levels[i].name;
            level.appendChild(levelName);

            const levelImage = document.createElement('img');
            levelImage.className = 'level-image';
            levelImage.src = 'assets/worlds/' + id + '/' + await world.levels[i].img;
            level.appendChild(levelImage);

            level.onclick = () => {
                const levelId = level.id.replace('level', '');
                const worldId = div.id.replace('world', '');
                window.location.href = 'game.html?world=' + worldId + '&level=' + levelId;
            }
        }
        mainMenu.insertBefore(div, lastNode);
        id++;
    }
}

function loadCustom() {
    levelsDiv = document.getElementById('customWorldLevels');
    levelsDiv.innerHTML = '';
    for (const [id, img] of Object.entries(saveMngr.data)) {
        const div = document.createElement('div');
        div.className = 'level';
        levelsDiv.appendChild(div);

        const header = document.createElement('div');
        header.className = 'level-header';

        const headerText = document.createElement('h2');
        headerText.className = 'level-name';
        headerText.innerHTML = img.name;
        header.appendChild(headerText);

        const headerDeleteButton = document.createElement('a');
        headerDeleteButton.className = 'level-delete';
        headerDeleteButton.innerHTML = 'X';
        headerDeleteButton.onclick = () => {
            deleteImg(id);
        }
        header.appendChild(headerDeleteButton);

        const image = document.createElement('img');
        image.className = 'level-image';
        image.src = img.imgData;

        div.appendChild(header);
        div.appendChild(image);
        div.onclick = () => {
            window.location.href = 'game.html?world=custom&level=' + id;
        }
        levelsDiv.appendChild(div);
    }
}

function deleteImg(id) {
    saveMngr.delImg(id);
    loadCustom();
}