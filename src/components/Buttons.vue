<script>
export default {
  props: {
    buttonClass: String,
    default: ''
  }
}
</script>

<template>
  <button class="buttons" :class="buttonClass">
        <slot></slot>
  </button>
</template>

<style>
.buttons {
  width: 100%;
  height: 5vh;
  padding: 5px;
  margin: 5px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  user-select: none;
}

.buttons:hover {
  background-color: #0056b3;
}
</style>
