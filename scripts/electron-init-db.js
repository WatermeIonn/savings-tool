const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { app } = require('electron');

function initDatabase() {
  // In packaged app, use userData directory for database
  const isDev = process.env.NODE_ENV === 'development';
  const userDataPath = isDev ? path.join(process.cwd(), '.data') : app.getPath('userData');
  const dbPath = path.join(userDataPath, 'database.sqlite');
  
  // Ensure the database directory exists
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
    console.log('Created database directory:', userDataPath);
  }

  // Update DATABASE_URL for the current session
  process.env.DATABASE_URL = `file:${dbPath}`;
  
  const dbExists = fs.existsSync(dbPath);
  
  if (!dbExists) {
    console.log('Database file not found, creating and running migrations...');
    try {
      // For packaged apps, we need to use prisma migrate deploy
      // which doesn't require the migration files to be in the exact same structure
      if (isDev) {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      } else {
        // In production, we'll use prisma db push instead of migrate deploy
        // since migration files might not be accessible in the same way
        execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
      }
      console.log('Database created successfully!');
    } catch (error) {
      console.error('Error setting up database:', error.message);
      // Create empty database file if migration fails
      fs.writeFileSync(dbPath, '');
      try {
        execSync('npx prisma db push', { stdio: 'inherit' });
      } catch (pushError) {
        console.error('Error with db push:', pushError.message);
      }
    }
  } else {
    console.log('Database file exists at:', dbPath);
    try {
      // Ensure schema is up to date
      execSync('npx prisma db push', { stdio: 'inherit' });
    } catch (error) {
      console.warn('Warning: Could not update database schema:', error.message);
    }
  }

  // Generate Prisma client
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated successfully!');
  } catch (error) {
    console.error('Error generating Prisma client:', error.message);
  }

  return dbPath;
}

module.exports = { initDatabase };
