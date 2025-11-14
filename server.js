import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();

// __dirname для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ЛОГИ — покажут путь, который Render использует
console.log("SERVER DIR:", __dirname);
console.log("PUBLIC DIR:", path.join(__dirname, 'public'));

// Раздаём /public
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  console.log("Client connected");

  ws.on('message', msg => {
    console.log("Message:", msg.toString());
    
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(msg.toString());
      }
    });
  });
});
