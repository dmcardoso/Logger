// Modules
const {BrowserWindow, Menu, Tray, ipcMain, app} = require('electron');
const path = require('path');

// BrowserWindow instance
exports.win;

// tray instance
exports.appIcon;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (this.win) {
            if (this.win.isMinimized()) this.win.restore();
            this.win.focus();
        }
    });
}

// mainWindow createWindow fn
exports.createWindow = () => {

    this.win = new BrowserWindow({
        width: 1200,
        height: 720,
        minWidth: 600,
        minHeight: 300,
        maxWidth: 1920,
        maxHeight: 1080,
        show: false,
        icon: path.resolve(__dirname, 'assets/logos/1024x1024.png')
    });

    this.win.once('ready-to-show', () => {
        this.win.show();
    });

    // Load main window content
    this.win.loadURL(`file://${__dirname}/index.html`);

    // Handle window minimize
    this.win.on('minimize', (e) => {
        this.win.hide();
    });

    // Handle window closed
    this.win.on('closed', (e) => {
        this.win = null;
    });

    // tray instance | set icon
    this.appIcon = new Tray(path.resolve(__dirname, 'assets/logos/1024x1024.png'));

    // title tray
    this.appIcon.setToolTip('Logger');

    // menu tray
    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir Logger',
            click: () => {
                this.win.show();
            }
        },
        {role: 'quit'}
    ]);

    //set menu tray
    this.appIcon.setContextMenu(trayMenu);

    // tray click fn
    this.appIcon.on('click', () => {
        this.appIcon.popUpContextMenu();
    });

    const template = [
        {
            label: 'Logger',
            submenu: [
                {role: 'toggledevtools'},
                {role: 'togglefullscreen'}
            ]
        },
        {
            label: 'Janela',
            submenu: [
                {role: 'minimize'},
                {role: 'close'}
            ]
        }
    ];

    // Add menu to app
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

};