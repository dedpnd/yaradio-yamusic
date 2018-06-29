const Store = require('electron-store');
const store = new Store({
  defaults:{
    lastApp: '',
    lastWindowState: {},    
  }
});

store.set('quit?',false);

module.exports = store