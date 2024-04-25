<script>
export default {
    props: ['chats', 'selectChat']
}
</script>
<template>
  <div class="chat-list">
    <div v-for="(chat, index) in chats" :key="index" class="chat-item" @click="selectChat(chat)">
      {{ chat.name }}
      <div> {{ chat.lastMessage.author }}: {{ chat.lastMessage.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.chat-list {
  margin-top: 10%;
  overflow-y: auto;
  user-select: none;
}

.chat-item {
  padding: 1em;
  cursor: pointer;
  background-color: #000000;
  width: 10vw;
  height: 10vh;
  text-align: left;
  border-bottom: solid 2px #ffffff82;
  color: #ffffff82;
  font-weight: bold;
  font-size: 12px;
}

.chat-item:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}
</style>