require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

async function seedAdmin() {
  try {
    // Authenticate with MySQL before seeding
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminName = process.env.ADMIN_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If an admin with the same email already exists, do not create a duplicate
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists. Skipping creation.`);
      return;
    }

    // Hash ADMIN_PASSWORD with the existing bcrypt dependency before storing it
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the admin user with role = 'admin'
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    }, { hooks: false }); // Skip hooks to avoid double hashing since we hashed it manually above

    console.log(`Admin user '${adminName}' created successfully.`);
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    // Close the Sequelize connection in both success and failure cases
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

seedAdmin();
