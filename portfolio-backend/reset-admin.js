if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user.model');

const NEW_USERNAME = 'alwin_regan';
const NEW_PASSWORD = 'Alwin@2527';

async function resetAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  const hashed = await bcrypt.hash(NEW_PASSWORD, 10);
  await User.create({ username: NEW_USERNAME, password: hashed, role: 'admin' });

  console.log('─────────────────────────────────');
  console.log('Admin credentials reset:');
  console.log('  Username:', NEW_USERNAME);
  console.log('  Password:', NEW_PASSWORD);
  console.log('─────────────────────────────────');

  await mongoose.disconnect();
}

resetAdmin().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
