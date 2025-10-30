const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { authenticate } = require('./middleware/authMiddleware');
const { createTables } = require('./database/migrations');
const { getDatabase } = require('./database');

const authRoutes = require('./routes/authRoutes');
const formsRoutes = require('./routes/formsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

createTables();
getDatabase();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookies.secret));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RBC Counselling Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/admin', authenticate, adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🎓 RBC Counselling Consultancy - Backend Server 🎓       ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Environment: ${config.env.padEnd(48)} ║
║  Server Port: ${PORT.toString().padEnd(48)} ║
║  Database:    ${config.databasePath.split('/').pop().padEnd(48)} ║
║                                                               ║
║  🌐 API Endpoints:                                            ║
║     Health Check:      /api/health                            ║
║     Authentication:    /api/auth/*                            ║
║     Forms:             /api/forms/*                           ║
║     Admin Dashboard:   /api/admin/*                           ║
║                                                               ║
║  📧 Email:    ${(config.email.user ? 'Configured ✓' : 'Not Configured ✗').padEnd(48)} ║
║  📱 SMS:      ${(config.sms.enabled ? 'Enabled ✓' : 'Disabled ✗').padEnd(48)} ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (config.isProduction) {
    server.close(() => process.exit(1));
  }
});

module.exports = app;
