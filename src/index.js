const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");
const { generateMessages } = require("./utils/messages");

const app = express();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = socket(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("join", ({ userName, room }) => {
    console.log(`User ${userName} joined room ${room}`);

    socket.join(room);
    socket.emit("message", generateMessages("Welcome!"));
    socket.broadcast.to(room).emit("message", generateMessages(`${userName} has joined!`));
  });

  socket.on("sendMessage", (message, callback) => {
    io.emit("message", generateMessages(message));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    io.emit("locationMessage", {
      url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
      createdAt: new Date().getTime(),
    });
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessages("A user has left!"));
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
