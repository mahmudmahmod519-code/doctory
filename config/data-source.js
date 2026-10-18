// config/data-source.js
require("reflect-metadata");
const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "um_al_qura",
    
    entities: [__dirname + "/../models/*.entity.js"],
    
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
});

module.exports = AppDataSource;