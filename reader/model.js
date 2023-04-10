const fs = require('fs');
const path = require('path');
const { model, Schema } = require('mongoose');
let models = {};
let configModels = {};
const{modules} = Aloop.options;

function addModels(dir, file){
  let model = require(path.join(dir, file));
  let name = model.name || path.parse(file).name;
  configModels[name] = configModels[name] || {attrs: {}, options: {}, inits: []};

  if (model.attrs) {
    configModels[name].attrs = {
      ...configModels[name].attrs,
      ...model.attrs
    };
  }

  if (model.options) {
    configModels[name].options = {
      ...configModels[name].options,
      ...model.options
    }
  }

  if (model.copy) {
    configModels[name].copy = model.copy;
  }

  if (model.init) {
    configModels[name].inits.push(model.init);
  }
}

modules.forEach((el) => {
  let root = Aloop.base.modulePath(el, 'models');
  
  if (fs.existsSync(root)) {
    fs
    .readdirSync(root)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      addModels(root, file);
    });
  }
});

for (let modelName in configModels) {
  if (configModels[modelName].copy) {
    configModels[modelName].attrs = {
      ...configModels[configModels[modelName].copy].attrs,
      ...configModels[modelName].attrs
    };

    configModels[modelName].options = {
      ...configModels[configModels[modelName].copy].options,
      ...configModels[modelName].options
    }
  }

  let sch = new Schema(
    configModels[modelName].attrs,
    configModels[modelName].options
  );

  configModels[modelName].inits.forEach((init) => {
    init(sch);
  });
  
  models[modelName] = model(modelName, sch);
}

module.exports = models;
