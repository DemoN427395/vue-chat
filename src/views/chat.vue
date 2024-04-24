<script>
import { socket } from '@/socket';
import store from '@/store/store';
import Chats from '../components/Chats.vue';

export default {
  components: {
    Chats
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      chats: [
      { name: "Чат 1", chatMessages: [{ author: "User1", text: "Привет!" }] },
      { name: "Чат 2", chatMessages: [{ author: "User2", text: "Как дела?" }] },
      { name: "Чат 3", chatMessages: [{ author: "User3", text: "Что делаешь?" }] }
      ],
      selectedChatIndex: 0
    };
  },
  computed: {
    userId() {
      return store.getters.getUserId;
    },
    username() {
      return store.getters.getUsername;
    },    
    messages() {
      return this.chats[this.selectedChatIndex].messages;
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
    },
      selectChat(chat) {
      this.selectedChatIndex = this.chats.indexOf(chat);
    },
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
      this.chats[this.selectedChatIndex].messages.push(message);
    });
  }
};
</script>

<template>
  <div class="parent">
    <div class="div1">
      <Chats :chats="chats" @selectChat="selectChat" />
    </div>
    <div class="div2">
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
    </div>
  </div>
</template>

<style scoped>
.parent {
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: 1fr;
grid-column-gap: 0px;
grid-row-gap: 0px;
}

.div1 { grid-area: 1 / 1 / 3 / 2; }
.div2 { grid-area: 1 / 2 / 3 / 3; }

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 90vw;
  padding: 20px;
  box-sizing: border-box;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
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
.message-input::placeholder {
  font: bold 13px Roboto, sans-serif;
  color: #ffffff;
}

.message-input:focus {
  outline: none;
  border-color: #007bff;
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