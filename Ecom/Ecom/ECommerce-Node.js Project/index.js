const http = require('http');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors'); // Import CORS package

require('dotenv').config();

// Connect to the database
connectDB();

// Set up CORS options if needed
const corsOptions = {
  origin: 'http://localhost:3000', // Change to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Create server with CORS
const server = http.createServer(async (req, res) => {
  // Apply CORS headers manually
  res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      req.body = JSON.parse(body);

      if (req.url.startsWith('/auth')) {
        return authRoutes(req, res);
      } else if (req.url.startsWith('/products')) {
        return productRoutes(req, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
    });
  } else if (req.method === 'GET') {
    if (req.url.startsWith('/products')) {
      return productRoutes(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Method not allowed" }));
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
