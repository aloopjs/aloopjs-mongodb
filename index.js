const mongoose = require('mongoose');

module.exports = {
  register(){
    global.App.models = () => require('./reader/model');
    mongoose.connect(global.App.config.mongodb.conn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  },
  boot({app}) {
    
  }
};
