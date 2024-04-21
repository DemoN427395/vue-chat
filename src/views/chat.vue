<script>
export default {
  data() {
    return {
      messages: [
        { author: 'User1', text: 'Привет, как дела?' },
        { author: 'User2', text: 'Всё в порядке, спасибо. А у тебя?' },
        // Добавьте здесь больше сообщений для демонстрации
      ],
      newMessage: ''
    };
  },
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    },
    username() {
      return this.$store.getters.getUsername;
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        // this.messages.push({ author: this.username, text: this.newMessage });
        console.log(this.userId);
        this.messages.push({ author_id: this.userId, author: this.username, text: this.newMessage });
        this.newMessage = '';
      }
    }
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
