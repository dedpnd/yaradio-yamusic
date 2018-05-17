const Store = require('electron-store');
const store = new Store({
  defaults:{
    lastWindowState: {},
    'quit?' : false
  }
});

module.exports = store