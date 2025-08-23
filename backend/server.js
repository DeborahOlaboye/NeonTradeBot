require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.set('io', io);
app.use('/api/agents', require('./routes/agents'));

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(3002, () => console.log('NeonTradeBot Backend running on port 3002'));