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
    const { status, search } = req.query;
    
    let queryParams = [];
    let baseQuery = '';
    
    if (req.user.role === 'student') {
        baseQuery = 'SELECT * FROM leave_requests WHERE student_id = ?';
        queryParams.push(req.user.id);
        
        if (status && status !== 'all') {
            baseQuery += ' AND status = ?';
            queryParams.push(status);
        }
    } else {
        // Faculty / Admin
        baseQuery = `
            SELECT lr.*, u.name as student_name, u.email as student_email 
            FROM leave_requests lr
            JOIN users u ON lr.student_id = u.id
            WHERE 1=1
        `;
        
        if (status && status !== 'all') {
            baseQuery += ' AND lr.status = ?';
            queryParams.push(status);
        }
        
        if (search) {
            baseQuery += ' AND (u.name LIKE ? OR lr.reason LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }
    }
    
    baseQuery += ' ORDER BY lr.created_at DESC';

    db.all(baseQuery, queryParams, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(rows);
    });
});

// Update leave status (Faculty/Admin only)
router.patch('/:id/status', authMiddleware, roleMiddleware(['faculty', 'admin']), (req, res) => {
    const { status, remarks } = req.body;
    const leaveId = req.params.id;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    db.get('SELECT student_id FROM leave_requests WHERE id = ?', [leaveId], (err, leave) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        db.run(
            'UPDATE leave_requests SET status = ?, remarks = ? WHERE id = ?',
            [status, remarks || null, leaveId],
            function (err) {
                if (err) return res.status(500).json({ message: 'Server error' });
                
                // Create a notification for the student
                const notificationMsg = `Your leave request has been ${status}. ${remarks ? `Remarks: ${remarks}` : ''}`;
                db.run('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [leave.student_id, notificationMsg]);
                
                res.json({ message: 'Leave status updated successfully' });
            }
        );
    });
});

module.exports = router;
