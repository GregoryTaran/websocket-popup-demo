const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './client.html';

    const ext = path.extname(filePath);
    const map = {
        '.html': 'text/html',
        '.js': 'text/javascript'
    };

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': map[ext] || 'text/plain' });
        res.end(data);
    });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log("Client connected");

    ws.on('message', msg => {
        console.log("Message from client:", msg.toString());

        // Шлём ВСЕМ клиентам
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
