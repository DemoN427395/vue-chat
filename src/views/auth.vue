<script>
import Buttons from '../components/Buttons.vue';

export default {
  components: {
    Buttons
  },
  data() {
    return {
      login: '',
      password: '',
      isLoggedIn: false
    };
  },
  methods: {
async signIn() {
 try {
    if (!this.login.trim() || !this.password.trim()) {
      alert('Пожалуйста, введите логин и пароль');
      return;
    }

    const user = {
      login: this.login,
      password: this.password
    };

    const response = await fetch('http://localhost:3000/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    const userId = data.userId;
    const username = data.username;
    const token = data.token;

    this.$store.dispatch('setUserId', userId);
    this.$store.dispatch('setUsername', username);
    localStorage.setItem('token', token);

    this.isLoggedIn = true;
    console.log(`username (login): ${username} id: (userId): ${userId}`);
    console.log('Sign in successful, redirecting to chat...');
    this.$router.push({ name: 'chat' });
} 
catch (error) {
        console.error('Ошибка аутентификации:', error.message);
        alert(error.message);
      }
    }
  }
};
</script>


<template>
  <div class="chat-app">
    <h2 v-if="!isLoggedIn" class="auth-title">Авторизация</h2>
    <div v-if="!isLoggedIn" class="auth-form">

      <input type="text" v-model="login" @keypress.enter="signIn" placeholder="Введите ваш логин" class="auth-input">
      <input type="text" v-model="password" @keypress.enter="signIn" placeholder="Введите пароль" class="auth-input">
      <div class="btn-container">
        <buttons @click="signIn" buttonClass="buttons">Войти</buttons>
        <router-link to="/register">
          <buttons buttonClass="buttons">Регистрация</buttons>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-app {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #2c2c2c;
}

.auth-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #fff;
  user-select: none;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.auth-input {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: #2c2c2c;
  color: #fff;
  text-align: center;
}

.auth-input:focus {
  outline: none;
  border-color: #007bff;
}

.auth-input::placeholder {
  color: #cccccc52;
  user-select: none;
}

.btn-container {
  margin-right: 7%;
}

.welcome-message {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>