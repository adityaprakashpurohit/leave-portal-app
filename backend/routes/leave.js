const express = require('express');
const { db } = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply for leave (Students only)
router.post('/', authMiddleware, roleMiddleware(['student']), (req, res) => {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    db.run(
        'INSERT INTO leave_requests (student_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
        [req.user.id, startDate, endDate, reason],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(201).json({ message: 'Leave application submitted', leaveId: this.lastID });
        }
    );
});

// Get leaves for a specific user (Students see their own, Admin/Faculty see all or filtered)
router.get('/', authMiddleware, (req, res) => {
    if (req.user.role === 'student') {
        db.all('SELECT * FROM leave_requests WHERE student_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json(rows);
        });
    } else {
        // Faculty / Admin
        db.all(`
            SELECT lr.*, u.name as student_name, u.email as student_email 
            FROM leave_requests lr
            JOIN users u ON lr.student_id = u.id
            ORDER BY lr.created_at DESC
        `, [], (err, rows) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json(rows);
        });
    }
});

// Update leave status (Faculty/Admin only)
router.patch('/:id/status', authMiddleware, roleMiddleware(['faculty', 'admin']), (req, res) => {
    const { status } = req.body;
    const leaveId = req.params.id;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    db.run(
        'UPDATE leave_requests SET status = ? WHERE id = ?',
        [status, leaveId],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Leave request not found' });
            }
            
            // Note: In a real app, create a notification for the student here
            res.json({ message: 'Leave status updated successfully' });
        }
    );
});

module.exports = router;
