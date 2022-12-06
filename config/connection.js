//important db related import
const Sequelize = require('sequelize');
require('dotenv').config();
//initializing sequelize but not declaring yet.
let sequelize;
//Heroku
if(process.env.JAWSDB_URL){
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else{//Local Host
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
      });
}
//export for use
module.exports = sequelize;