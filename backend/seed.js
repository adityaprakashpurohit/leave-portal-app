const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const seedDatabase = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    db.serialize(() => {
        // Seed Student
        db.run(`INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (1, 'Student User', 'student@test.com', ?, 'student')`, [hashedPassword]);
        
        // Seed Faculty
        db.run(`INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (2, 'Faculty User', 'faculty@test.com', ?, 'faculty')`, [hashedPassword]);
        
        // Seed Admin
        db.run(`INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (3, 'Admin User', 'admin@test.com', ?, 'admin')`, [hashedPassword]);
    });

    console.log("Database seeded successfully with test users!");
};

seedDatabase();
