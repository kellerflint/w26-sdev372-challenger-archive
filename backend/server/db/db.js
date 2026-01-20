import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config();

const { DB_DATABASE, DB_HOST, DB_PORT, DB_USER,DB_PASSWORD } = process.env

const sequelize = new Sequelize(
    DB_DATABASE, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: query => console.log((`SQL : ${query}`))
    });

    try {
        await sequelize.authenticate();
        console.log('Connected successfully.');
    } catch (error) {
        console.error('Unable to connect:', error);
    }
    
    export default sequelize;