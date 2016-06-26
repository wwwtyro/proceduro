var path = require('path');

var electron = require('electron');
var app = electron.app;
const {ipcMain} = require('electron');
var BrowserWindow = electron.BrowserWindow;
var builtins = require('./builtins');

if (process.env.PROCEDURO_RELOAD) {
    require('electron-reload')(__dirname, {
      electron: require('electron-prebuilt')
    });
}

var win;

function defaultMenu() {
    var submenu = Object.keys(builtins).map(function(bin) {
        bin = builtins[bin];
        return {
            label: bin.title,
            click() {
                loadApp(bin.title);
            }
        }
    });
    submenu.push.apply(submenu, [
        { type: 'separator' },
        {
            label: 'Welcome',
            click() {
                resetMenu()
                win.loadURL(`file://${__dirname}/welcome/index.html`);
            }
        }, 
        {
            label: 'Debug',
            accelerator: 'F12',
            click: function() {
                win.webContents.toggleDevTools();
            }
        }
    ]);
    return [{
        label: 'Proceduro',
        submenu: submenu
    }];
}

let currentMenuTemplate = defaultMenu();

function resetMenu() {
    currentMenuTemplate = defaultMenu();
    var menu = electron.Menu.buildFromTemplate(currentMenuTemplate);
    electron.Menu.setApplicationMenu(menu);
}

function consoleLog(msg) {
    win.webContents.send('log', msg);
}

function consoleError(msg) {
    win.webContents.send('error', msg);
}

function submenuGetItem(submenu, label) {
    for (let item of submenu) {
        if (item.label === label) {
            return item;
        }
    }
    return null;
}

ipcMain.on('append menu', function(e, data) {
    var path = data.path;
    var uuid = data.uuid;
    if (path.length === 0) {
        consoleError("Can't append to menu with no path.");
        return;
    }
    if (path[0] === 'Proceduro') {
        consoleError("Can't append to Proceduro menu item.");
        return;
    }
    let currentItem = currentMenuTemplate;
    for (let i = 0; i < path.length; i++) {
        const p = path[i];
        if (i === path.length - 1) {
            if (submenuGetItem(currentItem, p) !== null) {
                consoleError(`menu item ${p} already exists.`);
                return;
            }
            currentItem.push({
                label: p,
                click: function() {
                    win.webContents.send(uuid);
                }
            });
        } else {
            let item = submenuGetItem(currentItem, p);
            if (item === null) {
                item = {
                    label: p,
                    submenu: []
                }
                currentItem.push(item);
            }
            currentItem = item.submenu;
        }
    }
    var menu = electron.Menu.buildFromTemplate(currentMenuTemplate);
    electron.Menu.setApplicationMenu(menu);
})

ipcMain.on('set app menu', (event, arg) => {
  template = menuTemplate.slice();
  template.push(arg);
});

ipcMain.on('set application', (event, arg) => {
    loadApp(arg.name);
});

ipcMain.on('openDevTools', function(event, arg) {
    win.webContents.openDevTools();
});

function createWindow() {
    resetMenu();
    preloadPath = path.resolve(path.join(__dirname, 'preload.js'));
    win = new BrowserWindow({ 
        width: 1366, 
        height: 768,
        transparent: true,
        webPreferences: {
            preload: preloadPath
        }
    });
    win.loadURL(`file://${__dirname}/welcome/index.html`);
    win.on('closed', () => {
        win = null;
    });
}

function loadApp(name) {
    resetMenu();
    win.loadURL(`file://${path.join(builtins[name].path, 'index.html')}`);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});



