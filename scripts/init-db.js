const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the .data directory exists
const dataDir = path.join(__dirname, '..', '.data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created .data directory');
}

// Check if database file exists
const dbPath = path.join(dataDir, 'database.sqlite');
const dbExists = fs.existsSync(dbPath);

if (!dbExists) {
  console.log('Database file not found, creating and running migrations...');
  try {
    // Run migrations to create the database
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Database created and migrations applied successfully!');
  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  }
} else {
  console.log('Database file exists, ensuring migrations are up to date...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations applied successfully!');
  } catch (error) {
    console.error('Error applying migrations:', error.message);
    process.exit(1);
  }
}

// Generate Prisma client
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  process.exit(1);
}
