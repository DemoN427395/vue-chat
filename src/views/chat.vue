<script>
import { socket } from '@/socket';
import store from '@/store/store';

export default {
  data() {
    return {
      messages: [],
      newMessage: ''
    };
  },
  computed: {
    userId() {
      return store.getters.getUserId;
    },
    username() {
      return store.getters.getUsername;
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        const message = {
          author: this.username,
          text: this.newMessage
        };
        socket.emit('message', message);
        this.newMessage = '';
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    const userId = store.getters.getUserId;
    if (!userId) {
      next({ name: 'auth' });
    } else {
      next();
    }
  },
  mounted() {
    socket.on('connect', () => {
      console.log('Соединение установлено');
    });

    socket.on('disconnect', () => {
      console.log('Соединение разорвано');
    });

    socket.on('error', (error) => {
      console.error('Произошла ошибка при подключении:', error);
    });

    socket.on('message', (message) => {
      console.log('Получено новое сообщение на клиенте: ', message);
      this.messages.push(message);
    });
  }
};
</script>




<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span class="message-author">{{ message.author }}</span>: {{ message.text }}
      </div>

    </div>
    <form @submit.prevent="sendMessage" class="message-form">
      <input v-model="newMessage" type="text" placeholder="Введите ваше сообщение..." class="message-input">
      <button type="submit" class="message-submit">Отправить</button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
}

.message-author {
  font-weight: bold;
}

.message-form {
  display: flex;
  align-items: center;
}

.message-input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.message-submit {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
