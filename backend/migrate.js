const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Add remarks column if it doesn't exist
    db.run("ALTER TABLE leave_requests ADD COLUMN remarks TEXT", (err) => {
        if (err) {
            console.log("Column 'remarks' might already exist or error:", err.message);
        } else {
            console.log("Added 'remarks' column to leave_requests");
        }
    });

    // Let's seed departments and assign them
    db.run("INSERT OR IGNORE INTO departments (id, name) VALUES (1, 'Computer Science')");
    db.run("INSERT OR IGNORE INTO departments (id, name) VALUES (2, 'Electrical Engineering')");
    
    // Assign department 1 to all users just for demo analytics
    db.run("UPDATE users SET department_id = 1 WHERE department_id IS NULL");
});

db.close();
