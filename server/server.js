import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import url from 'url';
import { SaveToDB, getDataFromDB } from './classes/DB.js';
import { error } from 'console';


const app = express();
const port = 3000; 
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const saveToDB = new SaveToDB();
const getData = new getDataFromDB();

passport.use(new LocalStrategy(
  async (login, password, done) => {
    try {
      // Получаем пользователя по его логину из базы данных
      const user = await getData.getUserByLogin(login);
      
      // Проверяем, существует ли пользователь и совпадает ли его пароль
      if (!user || user.password !== password) {
        return done(null, false, { message: 'Неверный логин или пароль' });
      }
      
      // Если пользователь найден и пароль совпадает, передаем его в Passport.js
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
  

app.use(cors());
const logger = function(req, res, next) {
    console.log("Request IP: " + req.ip);
    console.log("Request Method: " + req.method);
    console.log("Request date: " + new Date());
  
    next();
  }

// app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(logger);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.post('/auth', async (req, res) => {
  try {
      // Extract login and password from the request body
      const { login, password } = req.body;

      // Check if login and password are provided
      if (!login || !password) {
          return res.status(400).json({ message: 'Login or password not provided' });
      }

      // Use the getDataFromDB class to check if the user exists
      const user = await getData.getUserByLogin(login);

      // If the user does not exist or the password does not match, send an error response
      if (!user || user.password !== password) {
          return res.status(400).json({ message: 'Incorrect login or password' });
      }

      // If the user exists and the password matches, send a success response
      res.status(200).json({ message: 'Authentication successful' });
  } catch (error) {
      // Handle any errors that occur during the process
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

      // Проверка наличия обязательных полей
      if (!user_id || !message_text) {
          return res.status(400).json({ message: 'Отсутствуют необходимые данные' });
      }

      // Добавление сообщения в базу данных
      const query = "INSERT INTO messages (user_id, message_text) VALUES (?, ?)";
      await db.query(query, [user_id, message_text]);

      // Отправка успешного ответа
      res.status(200).json({ message: 'Сообщение успешно добавлено' });
  } catch (error) {
      // Обработка ошибок
      console.error('Ошибка (add-message):', error.message);
      res.status(500).json({ message: 'Произошла ошибка при добавлении сообщения' });
  }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порте http://localhost:${port}`);
});