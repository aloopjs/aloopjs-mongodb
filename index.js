const mongoose = require('mongoose');

module.exports = {
  register(){
    global.App.models = () => require('./reader/model');
    mongoose.connect(global.App.config.mongodb.conn, global.App.config.mongodb.options || {});
  },
  boot({app}) {
    
  }
};
