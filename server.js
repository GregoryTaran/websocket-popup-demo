import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();

// Определяем __dirname для ES Modules (Render это любит)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Статические файлы из /public
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  console.log("Client connected");

  ws.on('message', msg => {
    console.log("Message from client:", msg.toString());

    // Пересылаем сообщение ВСЕМ подключенным
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(msg.toString());
      }
    });
  });
});
