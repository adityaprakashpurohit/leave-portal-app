const express = require('express');
const { db } = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin', 'faculty']), (req, res) => {
    const analytics = {
        totalLeaves: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        departmentWise: []
    };

    db.serialize(() => {
        db.get(`
            SELECT 
                COUNT(*) as totalLeaves,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
            FROM leave_requests
        `, (err, row) => {
            if (!err && row) {
                analytics.totalLeaves = row.totalLeaves || 0;
                analytics.pending = row.pending || 0;
                analytics.approved = row.approved || 0;
                analytics.rejected = row.rejected || 0;
            }
        });

        db.all(`
            SELECT d.name, COUNT(lr.id) as count
            FROM leave_requests lr
            JOIN users u ON lr.student_id = u.id
            JOIN departments d ON u.department_id = d.id
            GROUP BY d.id
        `, (err, rows) => {
            if (!err && rows) {
                analytics.departmentWise = rows;
            }
            res.json(analytics);
        });
    });
});

module.exports = router;
