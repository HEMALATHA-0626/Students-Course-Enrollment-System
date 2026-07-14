// Run this once after setting up the database:
//   node database/seed-admin.js
// Creates a default admin login -> username: admin | password: admin123
// Change the password after your first login in a real deployment.

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function seedAdmin() {
  try {
    const hashed = await bcrypt.hash('admin123', 10);

    await pool.query(
      `INSERT INTO admins (username, password) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      ['admin', hashed]
    );

    console.log('Default admin ready -> username: admin | password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
