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
    signUp() {
      if (this.login.trim() !== '' && this.password.trim() === this.repeatPassword.trim()) {
        let user = {
          login: this.login,
          password: this.password
        };
        console.log(user);

      fetch('http://localhost:3000/register', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify(user)
      })
      .then(response => {
       if (!response.ok) {
          return response.json().then(err => {
            throw err;
          });
       }
       return response.json();
      })
      .then(data => {
        console.log(data);
        this.$store.dispatch('setUsername', this.login);
        this.$router.push({ name: 'chat' });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        alert(error.message);
      });

      } else if (this.login.trim() === '') {
        console.log(alert('Пожалуйста, введите логин'));
      }
      else if (this.password.trim() !== this.repeatPassword.trim()) {
        console.log(alert('Пароли не совпадают'), 'Пароли не совпадают');
      }
      else if (this.password.trim() === '' || this.repeatPassword.trim() === '') {
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