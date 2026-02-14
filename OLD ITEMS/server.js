/**
 * KAVACH 2.0 — Local Development Server
 * 
 * Simple Express server for testing KAVACH locally before deployment.
 * Simulates Vercel serverless environment.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

// Import API handlers
const honeypotHandler = require('./api/honeypot');
const healthHandler = require('./api/health');
const metricsHandler = require('./api/metrics');
const shieldReportHandler = require('./api/shield-report');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for local testing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files
app.use(express.static('public'));

// API Routes (simulating Vercel serverless functions)
app.post('/api/honeypot', async (req, res) => {
  try {
    await honeypotHandler(req, res);
  } catch (err) {
    console.error('Honeypot handler error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await healthHandler(req, res);
  } catch (err) {
    console.error('Health handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/metrics', async (req, res) => {
  try {
    await metricsHandler(req, res);
  } catch (err) {
    console.error('Metrics handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/shield-report', async (req, res) => {
  try {
    await shieldReportHandler(req, res);
  } catch (err) {
    console.error('Shield report handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'POST /api/honeypot',
      'GET /api/health',
      'GET /api/metrics',
      'GET /api/shield-report',
      'GET / (Landing page)'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                   ║');
  console.log('║  🛡️  KAVACH 2.0 — Local Development Server                        ║');
  console.log('║                                                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  console.log(`🌐 Server running at: \x1b[36mhttp://localhost:${PORT}\x1b[0m\n`);
  console.log('📍 Available Endpoints:');
  console.log(`   • POST   http://localhost:${PORT}/api/honeypot`);
  console.log(`   • GET    http://localhost:${PORT}/api/health`);
  console.log(`   • GET    http://localhost:${PORT}/api/metrics`);
  console.log(`   • GET    http://localhost:${PORT}/api/shield-report`);
  console.log(`   • GET    http://localhost:${PORT}/ (Landing page)\n`);
  console.log('🔑 API Key:', process.env.API_KEY || 'fae26946fc2015d9bd6f1ddbb447e2f7');
  console.log('🤖 LLM Provider:', process.env.GEMINI_API_KEY ? '✅ Gemini' : '❌ No API key found');
  console.log('\n⚡ Press Ctrl+C to stop the server\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down KAVACH local server...\n');
  process.exit(0);
});
