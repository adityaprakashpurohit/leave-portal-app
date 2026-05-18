const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);

app.get('/', (req, res) => {
    res.send('Leave Application API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
