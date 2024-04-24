<script>
export default {
    props: ['chats', 'selectChat']
}
</script>
<template>
    <div class="chat-list">
        <div v-for="(chat, index) in chats" :key="index" class="chat-item" @click="selectChat(chat)">
            {{ chat.name }}
            <div v-for="(message, messageIndex) in chat.chatMessages" :key="messageIndex">
                {{ message.text }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-list {
  margin-top: 50%;
  overflow-y: auto;
  user-select: none;
}

.chat-item {
  padding: 10px;
  cursor: pointer;
  background-color: #000000;
  margin-bottom: 5px;
  width: 10vw;
  text-align: left;
  padding-left: 10px;
  border-radius: 0 1rem 1rem 0;
  color: #ffffff82;
  font-weight: bold;
  font-size: 10px;
}

.chat-item:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}
</style>