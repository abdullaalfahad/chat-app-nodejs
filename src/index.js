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

io.on("connection", () => {
  console.log("New Websocket Connection!");
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
