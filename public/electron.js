const {
  app,
  BrowserWindow,
  Menu,
  powerMonitor
} = require("electron");
const Store = require("electron-store");
const isDev = require("electron-is-dev");
const path = require("path");
const store = new Store();

global.notificationSettings = {
  resetNotification: store.get("reset") || true,
  reminderNotification: store.get("reminder") || "hour"
};

let mainWindow = {
  show: () => {
    console.log("show");
  }
}; // temp object while app loads
let willQuit = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    minWidth: 320,
    height: 600,
    fullscreenable: true,
    backgroundColor: "#403F4D",
    icon: path.join(__dirname, "assets/png/128x128.png"),
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

function menuSetup() {
  const menuTemplate = [
    {
      label: "todolist",
      submenu: [
      
        {
          type: "separator"
        },
        {
          
          /* For debugging */
          label: "Dev tools",
          click: () => {
            mainWindow.webContents.openDevTools();
          }
        },
        {
          label: "Quit",
          accelerator: "CommandOrControl+Q",
          click: () => {
            app.quit();
          }
        }
      ]
    }
    
   
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.on("ready", () => {
  createWindow();
  menuSetup();

  powerMonitor.on("resume", () => {
    mainWindow.reload();
  });

  // On Mac, this will hide the window
  // On Windows, the app will close and quit
  mainWindow.on("close", e => {
    if (willQuit || process.platform === "win32") {
      mainWindow = null;
      app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });
});

app.on("activate", () => mainWindow.show());
app.on("before-quit", () => (willQuit = true));
