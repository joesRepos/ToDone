const fs = require('fs');
const { initDB } = require('./db.js');

const DB_FILE = './database.db';

const setup = async () => {
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
    console.log(" Old database deleted");
  }

  const db = await initDB();

  // Recreate tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      priority INTEGER DEFAULT 1,
      completed BOOLEAN DEFAULT 0,
      due_date TEXT
    );
  `);

  console.log("New database created and tasks table initilaised.");
  await db.close();
};

setup();