import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

// --------------------------------------------------
// Правильный __dirname для ES Modules (Render friendly)
// --------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// Express + HTTP сервер
// --------------------------------------------------
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

// --------------------------------------------------
// WebSocket сервер
// --------------------------------------------------
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    console.log("Message from client:", data.toString());

    // Рассылаем всем клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// --------------------------------------------------
// Правильная раздача файла из папки public
// --------------------------------------------------
const PUBLIC_DIR = path.join(__dirname, "public");

console.log("Serving static files from:", PUBLIC_DIR);

app.use(express.static(PUBLIC_DIR));

// если файл не найден — грузим index.html (для SPA и fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// --------------------------------------------------
// Start server
// --------------------------------------------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
