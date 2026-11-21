require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Route and module imports with universal path resolution
const hasLocalConfig = fs.existsSync(path.join(__dirname, 'config/db.js'));
const { connectDB } = hasLocalConfig ? require('./config/db') : require('./src/config/db');
const errorHandler = hasLocalConfig ? require('./middleware/errorHandler') : require('./src/middleware/errorHandler');

const routeBase = hasLocalConfig ? './routes' : './src/routes';
const authRoutes = require(`${routeBase}/authRoutes`);
const itemRoutes = require(`${routeBase}/itemRoutes`);
const claimRoutes = require(`${routeBase}/claimRoutes`);
const notificationRoutes = require(`${routeBase}/notificationRoutes`);
const statsRoutes = require(`${routeBase}/statsRoutes`);
const heroesRoutes = require(`${routeBase}/heroesRoutes`);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (MongoDB or embedded fallback)
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (supports both public/ and client/ layouts)
const clientPaths = [
  path.join(__dirname, '../client'),
  path.join(__dirname, 'client'),
  path.join(__dirname, 'public'),
  path.join(__dirname, '../public')
];
const clientStaticDir = clientPaths.find(p => fs.existsSync(p)) || path.join(__dirname, 'public');
app.use(express.static(clientStaticDir));

const uploadPaths = [
  path.join(__dirname, '../client/uploads'),
  path.join(__dirname, 'client/uploads'),
  path.join(__dirname, 'public/uploads'),
  path.join(__dirname, 'uploads')
];
const uploadStaticDir = uploadPaths.find(p => fs.existsSync(p)) || path.join(__dirname, 'public/uploads');
app.use('/uploads', express.static(uploadStaticDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    portal: 'FINDORA — Sai University Campus Lost & Found Portal',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/heroes', heroesRoutes);

// Fallback to index.html for SPA client navigation
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientStaticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Centralized error handling
app.use(errorHandler);

// Start server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` 🚀 FINDORA Portal running at http://localhost:${PORT}`);
    console.log(` 🎓 Sai University Web Technology & Internet Programming`);
    console.log(` 📊 Golfee-Inspired Modular Campus Dashboard active`);
    console.log(`====================================================`);
  });
}

module.exports = app;
