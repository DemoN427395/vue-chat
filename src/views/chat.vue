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
      selectedChatIndex: 0,
      isChatActive: false,
      showMessageInput: false
    };
  },
  computed: {
    userId() {
      return store.getters.getUserId;
    },
    username() {
      return store.getters.getUsername;
    },
    lastMessages() {
      return this.chats.map(chat => {
        if (chat.chatMessages.length > 0) {
          const lastMessage = chat.chatMessages[chat.chatMessages.length - 1];
          return { ...chat, lastMessage };
        } else {
          return { ...chat, lastMessage: { text: "No messages" } };
        }
      });
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
    checkAuthentication() {
      const userId = store.getters.getUserId;
      if (!userId) {
        this.$router.push({ name: 'auth' });
      }
    }
  },
  mounted() {
    this.checkAuthentication();

    socket.on('message', (message) => {
      console.log('Получено новое сообщение на клиенте: ', message);
      this.chats[this.selectedChatIndex].chatMessages.push(message);
      this.messages.push(message);
      this.$nextTick(() => {
        const messageContainer = this.$refs.messageContainer;
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });
    });
  }
};
</script>

<template>
  <div class="parent">
    <div class="div1">
      <input type="text" class="search-input" placeholder="Поиск пользователя"/>
      <Chats :chats="lastMessages" @selectChat="selectChat" />
    </div>
    <div class="div2">
      <div class="chat-container">
        <div class="messages" ref="messageContainer">
          <div v-for="(message, index) in messages" :key="index" class="message" :class="{ 'own-message': message.author === username }">
            <template v-if="message.author !== username">
              <span class="message-author">{{ message.author }}</span>:
            </template>
            {{ message.text }}
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
  padding: 1em 4rem 1em 4em;
  box-sizing: border-box;
  background-color: #303030;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 1em;
}

.messages::-webkit-scrollbar {
  width: 1em;
}

.messages::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px; 
}

.messages::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5); 
}

.message {
  margin-bottom: 10px;
}

.own-message {
  text-align: right;
}

.message-author {
  font-weight: bold;
}

.message-form {
  display: flex;
  align-items: center;
  margin-top:1em;
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

.search-input {
  background-color: #2c2c2c;
  border: none;
  color: #fff;
  text-align: center;
  width: 100%;
  height: 5%;
}
</style>