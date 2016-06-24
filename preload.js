const {remote, ipcRenderer} = require('electron');
const uuid4 = require('uuid4');
const ec2b = require('electron-canvas-to-buffer');
const fs = require('fs');
const {dialog} = require('electron').remote;
const builtins = require('./builtins');

window.proceduro = {
    appendMenu: function(path, callback) {
        const uuid = uuid4();
        ipcRenderer.on(uuid, callback);
        ipcRenderer.send('append menu', {
            path: path,
            uuid: uuid
        });
    },
    
    saveCanvasToPNG: function(path, canvas) {
        let buffer = ec2b(canvas);
        fs.writeFile(path, buffer);
    },
    
    setApp: function(appName) {
        ipcRenderer.send('set application', {
            name: appName
        });
    },
    
    builtins: builtins,
    
    dialog: dialog,
}

ipcRenderer.on('log', function(e, data) {
    console.log('Proceduro: ' + data);
});

ipcRenderer.on('error', function(e, data) {
    console.error('Proceduro: ' + data);
});

window.onerror = function(e) {
    ipcRenderer.send('openDevTools');
}
