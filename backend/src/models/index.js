const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfiguration = require('../config/database');

const sequelize = new Sequelize(
  dbConfiguration.database,
  dbConfiguration.username,
  dbConfiguration.password,
  dbConfiguration
);

const db = {};


fs.readdirSync(__dirname)
.filter(file =>{
    return(
  file.indexOf('.') !== 0 &&
  file !== 'index.js' &&
  file.slice(-3) === '.js' 
    );
})

 .forEach(file => {
    // Importation des modèles
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName =>{
    if(db[modelName].associate){
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;