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
    signIn() {
      if (this.login.trim() !== '' && this.password.trim() !== '') {
          // Define the user object with the login and password
          let user = {
              login: this.login,
              password: this.password
          };

          fetch('http://localhost:3000/auth', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(user) // Use the user object here
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
            if (data.message) {
                // alert(data.message);
                this.$store.dispatch('setUsername', this.login);
                this.$router.push({ name: 'chat' });
            } 
            // else {
            //     this.$store.dispatch('setUsername', this.login);
            //     console.log('Redirecting to chat');
            //     this.$router.push({ name: 'chat' });
            //     console.log('Redirection command sent');
            // }
          })
          .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
              alert(error.message);
          });
      } else if (this.login.trim() === '') {
          alert('Пожалуйста, введите логин');
      } else {
          alert('Пожалуйста, введите ваш пароль');
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
    <div v-else>
      <h2 class="welcome-message">Привет, {{ login }}!</h2>
      <h2 class="welcome-message">Пароль, {{ password }}</h2>
      <!-- Здесь будет ваша основная часть чата -->
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