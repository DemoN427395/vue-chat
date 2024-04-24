import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

export const socket = io(URL);

socket.on("connect", () => {
  state.connected = true;
  console.log('Socket connected');
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log('Socket disconnected');

});

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});