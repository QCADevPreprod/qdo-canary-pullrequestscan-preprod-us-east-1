const { app, BrowserWindow, Menu } = require('electron');
const ipc = require('electron').ipcRenderer;

function createWindow () {
    const win = new BrowserWindow({
        title: "ForceAwakens Event Video Review",
        width: 710,
        height: 510,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // devTools: true
        }
    });

    win.loadFile('index.html');
    // win.webContents.openDevTools();

    Menu.setApplicationMenu(createMenu());

    const usernameFld = document.getElementById('username');
    usernameFld.focus();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

app.commandLine.appendSwitch('ignore-certificate-errors'); // TODO: issue a good certificate for the servers

function createMenu() {
    const isMac = process.platform === 'darwin'

    const template = [
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        /*
        {
          label: 'File',
          submenu: [
            {
              label: 'Connect...',
              click() { openLogon(); }
            }
          ]
        },
        */
    ]

    const menu = Menu.buildFromTemplate(template)
    return menu;
}

function buttonClickedHandler() {
    const videoDiv = document.getElementById('videoDiv');
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.innerHTML = '<source src="/resources/videos/video.mp4" type="video/mp4">';
}

var logonWin = null;

function openLogon() {
    if (logonWin) {
        logonWin.focus();
        return;
    }

    logonWin = new BrowserWindow({
        height: 185,
        width: 270,
        title: 'Logon',
        // parent: BrowserWindow.getFocusedWindow(),
        // modal: true,
        // resizable: false,
        minimizable: false,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            //Code added for integration test
            allowRunningInsecureContent: true, // TODO: issue a good certificate for the servers
            // webSecurity: false, // TODO: issue a good certificate for the servers
            devTools: true
        }
    });

    logonWin.loadURL('file://' + __dirname + '/views/logon.html');

    logonWin.on('closed', function() {
        logonWin = null;
    });

    logonWin.webContents.openDevTools();
}