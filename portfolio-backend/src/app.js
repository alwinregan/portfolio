if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const bcrypt = require('bcrypt');

const app = express();

// CORS — explicit origin list + preflight handling
const corsOptions = {
  origin: [
    'https://alwinregan.com',
    'https://www.alwinregan.com',
    'https://portfolio.rupeecollect.in',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.options('*', cors(corsOptions)); // preflight for all routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve built frontend (production)
const frontendDist = path.join(__dirname, '..', '..', 'portfolio-frontend', 'dist');
app.use(express.static(frontendDist));

// Routes
const API = '/api';
app.use(API, require('./routes/auth.routes'));
app.use(API, require('./routes/profile.routes'));
app.use(API, require('./routes/projects.routes'));
app.use(API, require('./routes/skills.routes'));
app.use(API, require('./routes/experience.routes'));
app.use(API, require('./routes/certifications.routes'));
app.use(API, require('./routes/contact.routes'));
app.use(API, require('./routes/settings.routes'));
app.use(API, require('./routes/uploads.routes'));
app.use(API, require('./routes/blog.routes'));
app.use(API, require('./routes/apps.routes'));
app.use(API, require('./routes/blocks.routes'));
app.use(API, require('./routes/export.routes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// SPA fallback — send index.html for any non-API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  const indexFile = path.join(frontendDist, 'index.html');
  res.sendFile(indexFile, err => { if (err) next(); });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
});

async function bootstrap() {
  await connectDB();

  // Ensure initial admin user exists
  const User = require('./models/user.model');
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  let exists = await User.findOne({ username: adminUsername });
  if (!exists) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({ username: adminUsername, password: hashed, role: 'admin' });
    console.log(`Admin user created → username: ${adminUsername}`);
  } else {
    console.log(`Admin user exists → username: ${adminUsername}`);
  }

  const port = process.env.PORT || 4000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend running on http://0.0.0.0:${port}`);
  });
}

bootstrap();
