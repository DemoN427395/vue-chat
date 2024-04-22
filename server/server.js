import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import url from 'url';
import { ConnectToDB, SaveToDB, getDataFromDB } from './classes/DB.js';

const app = express();
const port = 3000;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const db = new ConnectToDB();

db.connect()
  .then(() => {
    const saveToDB = new SaveToDB(db);
    const getData = new getDataFromDB(db);

    passport.use(new LocalStrategy(
      async (login, password, done) => {
        try {
          const user = await getData.getUserByLogin(login);
          
          if (!user || user.password !== password) {
            return done(null, false, { message: 'Неверный логин или пароль' });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    ));
      
    app.use(cors());
    app.use(express.static(path.join(__dirname, '../dist')));
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(passport.initialize());
    
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    
    app.post('/auth', async (req, res) => {
      try {
        const { login, password } = req.body;
    
        if (!login || !password) {
          return res.status(400).json({ message: 'Login or password not provided' });
        }
    
        const user = await getData.getUserByLogin(login);
    
        if (!user || user.password !== password) {
          return res.status(400).json({ message: 'Incorrect login or password' });
        }
    
        res.status(200).json({ message: 'Authentication successful' });
      } catch (error) {
        console.error('Ошибка (auth):', error.message);
        res.status(500).json({ message: 'An error occurred during authentication' });
      }
    });
    
    app.post('/register', async (req, res) => {
      try {
        const login = req.body.login;
        const user = await getData.getUserByLogin(login);
        if (user) {
          console.log('Пользователь с таким именем уже существует');
          return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
        }
        const newUser = await saveToDB.save(login, req.body.password);
        res.status(200).json({ message: 'Регистрация прошла успешно' });
      } catch (error) {
        console.error('Ошибка регистрации:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(error.message);
          return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
        }
        res.status(500).json({ message: 'Ошибка регистрации' });
      }
    });
    
    app.post('/add-message', async (req, res) => {
      try {
        const { user_id, message_text } = req.body;
    
        if (!user_id || !message_text) {
          return res.status(400).json({ message: 'Отсутствуют необходимые данные' });
        }
    
        const query = "INSERT INTO messages (user_id, message_text) VALUES (?, ?)";
        await db.query(query, [user_id, message_text]);
    
        res.status(200).json({ message: 'Сообщение успешно добавлено' });
      } catch (error) {
        console.error('Ошибка (add-message):', error.message);
        res.status(500).json({ message: 'Произошла ошибка при добавлении сообщения' });
      }
    });
    
    app.listen(port, () => {
      console.log(`Сервер запущен на порте http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка при подключении к базе данных:', error.message);
  });