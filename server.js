const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();

// 📌 Папка public раздаётся автоматически
app.use(express.static(path.join(__dirname, "public")));

// 📌 На корневой путь / отдаём public/client.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "client.html"));
});

// 📌 Настройка сервера HTTP
const server = http.createServer(app);

// 📌 WebSocket сервер
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
  });

  ws.send("Connected to WebSocket");
});

// 📌 Render PORT support
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
