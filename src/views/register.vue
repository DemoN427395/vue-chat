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
      repeatPassword: '',
      isLoggedIn: false
    };
  },
  methods: {
    async signUp() {
      if (this.login.trim() !== '' && this.password.trim() === this.repeatPassword.trim()) {
        const user = {
          login: this.login,
          password: this.password
        };

        try {
          const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const data = await response.json();
          console.log(data);

          // Save JWT token to local storage or Vuex store
          localStorage.setItem('token', data.token);

          this.$store.dispatch('setUsername', this.login);
          this.$router.push({ name: 'chat' });
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
          alert('Registration failed');
        }
      } else if (this.login.trim() === '') {
        alert('Пожалуйста, введите логин');
      } else if (this.password.trim() !== this.repeatPassword.trim()) {
        alert('Пароли не совпадают');
      } else if (this.password.trim() === '' || this.repeatPassword.trim() === '') {
        alert('Пожалуйста, введите ваш пароль');
      }
    }
  }
};
</script>

<template>
  <div class="chat-app">
    <h2 v-if="!isLoggedIn" class="auth-title">Регистрация</h2>
    <div v-if="!isLoggedIn" class="auth-form">

      <input type="text" v-model="login" @keypress.enter="signUp" placeholder="Введите ваш логин" class="auth-input">
      <input type="text" v-model="password" @keypress.enter="signUp" placeholder="Введите пароль" class="auth-input">
      <input type="text" v-model="repeatPassword" @keypress.enter="signUp" placeholder="Подтвердите пароль" class="auth-input">
      <div class="btn-container">
        <buttons @click="signUp" buttonClass="buttons">Зарегистрироваться</buttons>
        <router-link to="/">
          <buttons buttonClass="buttons">Авторизация</buttons>
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
 text-align: center; /* Add a semicolon here */
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