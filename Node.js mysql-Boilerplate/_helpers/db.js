const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.export = db = {};

initialize();

async function initialize(){
    // Create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({host, port, user, password});
    await connection.query(`CREATE DATABASE IF NOT EXIST \` ${database}\`;`);

    //connect to db
    const sequelize = new Sequelize(database,user,password, { dialect: 'mysql'});

    //init models and add then to the exported db object
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-tokem.model')(sequelize);

    //define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE'});
    db.RefreshToken.belongsTo(db.Account);

    //sync all models with database
    await sequelize.sync();

}