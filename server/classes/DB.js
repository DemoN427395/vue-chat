import mysql from 'mysql2';
import dotenv from 'dotenv';
// import path from 'path';
// import url from 'url';

// const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
// const envPath = path.join(__dirname, '.env');
// dotenv.config({path: envPath});
// console.log(dotenv.config());


dotenv.config();


class ConnectToDB {
    constructor() {
        this.connection = null;
    }

    async connect() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.USER,
            database: process.env.DATABASE,
            password: process.env.PASSWORD 
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
        } catch (err) {
            console.error("Ошибка (connect): " + err.message);
        }
    }

    async query(query, params) {
        if (!this.connection) {
            console.error("Соединение с базой данных не установлено");
            throw new Error("Соединение с базой данных не установлено");
        }
        try {
            const [results, fields] = await new Promise((resolve, reject) => {
                this.connection.query(query, params, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([results, fields]);
                    }
                });
            });
            return [results, fields];
        } catch (err) {
            console.error("Ошибка (query): " + err.message);
            throw err;
        }
    }

    async endConnection() {
        if (this.connection) {
            try {
                await new Promise((resolve, reject) => {
                    this.connection.end(function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                console.log("Подключение закрыто");
            } catch (err) {
                console.error("Ошибка (endConnection): " + err.message);
            }
        }
    }
}

class SaveToDB {
    constructor() {
        this.db = new ConnectToDB();
    }

    async save(login, password) {
        try {
            await this.db.connect();
            if (!login || !password) {
                console.error("Login or password not provided for insertion.");
                return;
            }
            // Construct the users object
            const users = { login: login, password: password };
            const query = "INSERT INTO users SET ?";
            const [results, fields] = await this.db.query(query, users);
            console.log("Запись успешно добавлена");
            await this.db.endConnection();
        } catch (err) {
            console.error("Ошибка (save): " + err.message);
        }
    }
}

class getDataFromDB {
    constructor() {
        this.db = new ConnectToDB();
    }

    async getData() {
        try {
            await this.db.connect();
            const query = "SELECT * FROM users";
            const [rows, fields] = await this.db.query(query);
            // console.log(rows);
            await this.db.endConnection();
            return rows;
        } catch (err) {
            console.error("Ошибка (getData): " + err.message);
            throw err;
        }
    }
    async getUserByLogin(login) {
        try {
            await this.db.connect();
            const query = "SELECT * FROM users WHERE login = ?";
            const [rows, fields] = await this.db.query(query, [login]);
            await this.db.endConnection();
            return rows[0];
        } catch (err) {
            console.error("Ошибка (getUserByLogin): " + err.message);
            throw err;
        }
    }
}

const save = new SaveToDB();
save.save();

const getData = new getDataFromDB();
getData.getData();

export { SaveToDB, getDataFromDB };