import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';


dotenv.config();

class ConnectToDB {
    constructor() {
        this.connection = null;
        this.checkedDB = false;
    }

    async connect() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.USER || 'nodeServer',
            password: process.env.PASSWORD || 'VLbwUP#AKh9eNZOhd6p9',
        });
    
        try {
            await new Promise((resolve, reject) => {
                this.connection.connect(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            console.log("Подключение к серверу MySQL успешно установлено");
            await this.createDatabaseAndTables();
        } catch (err) {
            console.error("Ошибка (connect): " + err.message);
        }
    }
    

    async createDB() {
        return new Promise((resolve, reject) => {
            this.connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`, (err) => {
                if (err) {
                    console.error("Ошибка (createDB): " + err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async checkDB() {
        try {
            console.log("Подключение к базе данных...");
            await this.connection.promise().query('USE ' + process.env.DATABASE);
            console.log("База данных уже существует");
            await this.createTables();
        } catch (err) {
            console.log("База данных не существует, создаем новую...");
            try {
                await this.createDB();
                console.log("База данных успешно создана");
                await this.createTables();
            } catch (err) {
                console.error("Ошибка при создании базы данных: " + err.message);
            }
        }
    }
    

    async createTables() {
        await this.query(`USE ${process.env.DATABASE}`);
    
        await this.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                login VARCHAR(512),
                password VARCHAR(512)
            )`);   // login VARCHAR(512) UNIQUE,
    
        await this.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                message VARCHAR(512),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);
    }
    
    async createUserChatTable(login) {
        await this.query(`USE ${process.env.DATABASE}`);

        await this.query(`
            CREATE TABLE IF NOT EXISTS ${login} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message VARCHAR(512)
            )`);
    }

    async createDatabaseAndTables() {
        try {
            await this.createDB();
            await this.createTables();
        } catch (err) {
            if (err.code === 'ER_DB_CREATE_EXISTS') {
                console.log("База данных уже существует");
                await this.checkDB();
            } else {
                console.error("Ошибка (createDatabaseAndTables): " + err.message);
            }
        }
    }

    async query(query, params) {
        try {
            const [results, fields] = await this.connection.promise().query(query, params);
            return [results, fields];
        } catch (err) {
            console.error("Ошибка (query): " + err.message);
            throw err;
        }
    }

    async endConnection() {
        try {
            await this.connection.promise().end();
            console.log("Подключение закрыто");
        } catch (err) {
            console.error("Ошибка (endConnection): " + err.message);
        }
    }
}

class SaveToDB {
    constructor(connection) {
        this.db = connection;
    }

    async save(login, password, jwtSecret) {
        try {
            if (!login || !password || !jwtSecret) {
                console.error("Login, password, or JWT secret not provided for insertion.");
                return;
            }
            await this.db.connect();
            const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
            const users = { login: login, password: hashedPassword, jwt_secret: jwtSecret };
            const query = "INSERT INTO users SET ?";
            const [results, fields] = await this.db.query(query, users);
            console.log("Запись успешно добавлена");
        } catch (err) {
            console.error("Ошибка (save): " + err.message);
        } finally {
            await this.db.endConnection();
        }
    }
}

class getDataFromDB {
    constructor(connection) {
        this.db = connection;
    }

    async getData() {
        try {
            await this.db.connect();
            const query = "SELECT * FROM users";
            const [rows, fields] = await this.db.query(query);
            return rows;
        } catch (err) {
            console.error("Ошибка (getData): " + err.message);
            throw err;
        } finally {
            await this.db.endConnection();
        }
    }

    async getUserByLogin(login) {
        try {
            await this.db.connect();
            const query = "SELECT * FROM users WHERE login = ?";
            const [rows, fields] = await this.db.query(query, [login]);
            return rows[0];
        } catch (err) {
            console.error("Ошибка (getUserByLogin): " + err.message);
            throw err;
        } finally {
            await this.db.endConnection();
        }
    }
}

export { ConnectToDB, SaveToDB, getDataFromDB };

