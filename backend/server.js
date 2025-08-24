require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const corsOrigins = [
  "http://localhost:3001", 
  "http://localhost:3000", 
  "http://localhost:5173", 
  "http://localhost:5174",
  "https://neon-trade-bot.vercel.app",
  "https://neontradebot.vercel.app",
  "https://neontradebot-frontend.vercel.app",
  "https://neontradebot.onrender.com",
  /^https:\/\/.*\.vercel\.app$/
];

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());
app.set('io', io);

// API Key Authentication Middleware
const API_KEY = process.env.API_KEY || 'neontradebot-2025';

const authenticateAPI = (req, res, next) => {
  // Skip auth for health check and root endpoint
  if (req.path === '/health' || req.path === '/') {
    return next();
  }
  
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Valid API key required',
      hint: 'Include X-API-Key header with your request'
    });
  }
  
  next();
};

app.use(authenticateAPI);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'NeonTradeBot Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      agents: '/api/agents/*'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'NeonTradeBot Backend', timestamp: new Date().toISOString() });
});

app.use('/api/agents', require('./routes/agents'));

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`NeonTradeBot Backend running on port ${PORT}`));