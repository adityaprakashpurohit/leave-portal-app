const express = require('express');
const { db } = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(rows);
    });
});

router.patch('/:id/read', authMiddleware, (req, res) => {
    db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Marked as read' });
    });
});

module.exports = router;
