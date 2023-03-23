
const {
    app, BrowserWindw, BrowserWindow
} = require('electron')
function createWindow() {
    const w = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration:false
        }
    })
    w.loadFile('index.html')
}
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
if (process.platform !== 'darwin') {
    app.quit()
}
})