const mongoose = require('mongoose');

module.exports = {
  register(){
    global.Aloop.models = () => require('./reader/model');
    mongoose.set('strictQuery', global.Aloop.config.mongodb.strict || false);
    mongoose.connect(global.Aloop.config.mongodb.conn, global.Aloop.config.mongodb.options || {});
  },
  boot({app}) {
    
  }
};
