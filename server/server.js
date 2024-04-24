import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import url from 'url';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ConnectToDB, SaveToDB, getDataFromDB } from './classes/DB.js';
import './message_server.js';

const app = express();
const port = process.env.PORT;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));


const db = new ConnectToDB();

db.connect()
  .then(() => {
    const saveToDB = new SaveToDB(db);
    const getData = new getDataFromDB(db);

    app.use(express.json());
    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.static(path.join(__dirname, '..', 'dist')));

    app.post('/auth', async (req, res) => {
      try {
        const { login, password } = req.body;
    
        if (!login || !password) {
          return res.status(400).json({ message: 'Login or password not provided' });
        }
    
        const user = await getData.getUserByLogin(login);
    
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
    
        const passwordMatch = bcrypt.compareSync(password, user.password);
    
        if (!passwordMatch) {
          return res.status(400).json({ message: 'Incorrect login or password' });
        }
    
        const jwtSecret = user.jwt_secret;
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
    
        res.status(200).json({ message: 'Authentication successful', token, userId: user.id, username: user.login });
      } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(500).json({ message: 'An error occurred during authentication' });
      }
    });
    
    
    app.post('/register', async (req, res) => {
      try {
          const { login, password } = req.body;
          const jwtSecret = generateJWTSecret();
  
          const newUser = await saveToDB.save(login, password, jwtSecret);
  
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
  

    app.listen(port, () => {
      console.log(`Сервер запущен на порте http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка при подключении к базе данных:', error.message);
  });

function generateJWTSecret() {
  return bcrypt.hashSync(Math.random().toString(36).substring(2, 15), 10);
}