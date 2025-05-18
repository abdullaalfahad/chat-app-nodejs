const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");
const { generateMessages } = require("./utils/messages");
const { getUser, getUsersInRoom, addUser, removeUser } = require("./utils/users");

const app = express();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = socket(server);

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessages("Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessages(`${user.username} has joined!`));

    callback();
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
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessages(`${user.username} has left!`));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
