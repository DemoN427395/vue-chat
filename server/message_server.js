import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT_MESSAGES;

const server = app.listen(port, () => {
  console.log(`Сервер сообщений запущен на порте ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Новое соединение');
  

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });

  socket.on('message', (message) => {
    console.log('Получено новое сообщение:', message);
    io.emit('message', message);
  });
});
