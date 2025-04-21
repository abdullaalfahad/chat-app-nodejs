const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");

const app = express();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = socket(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New Websocket Connection!");

  socket.emit("message", "Welcome to the chat app!");

  socket.broadcast.emit("message", "A new user had joined!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("sendLocation", (coords) => {
    io.emit("message", `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user had left!");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
