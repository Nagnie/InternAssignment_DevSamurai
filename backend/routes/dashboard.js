const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user statistics (protected route)
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await db.User.count();

        // Get users registered today
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const usersToday = await db.User.count({
            where: {
                createdAt: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        // Get users registered this week
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        const usersThisWeek = await db.User.count({
            where: {
                createdAt: {
                    [Op.gte]: weekStart
                }
            }
        });

        // Get users registered this month
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const usersThisMonth = await db.User.count({
            where: {
                createdAt: {
                    [Op.gte]: monthStart
                }
            }
        });

        // Get user registrations by day for the last 7 days (for chart)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const count = await db.User.count({
                where: {
                    createdAt: {
                        [Op.gte]: date,
                        [Op.lt]: nextDate
                    }
                }
            });

            last7Days.push({
                date: date.toISOString().split('T')[0],
                count
            });
        }

        // Get user registrations by month for the last 6 months (for chart)
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const count = await db.User.count({
                where: {
                    createdAt: {
                        [Op.gte]: date,
                        [Op.lt]: nextMonth
                    }
                }
            });

            last6Months.push({
                month: date.toISOString().substring(0, 7), // YYYY-MM format
                count
            });
        }

        res.json({
            totalUsers,
            usersToday,
            usersThisWeek,
            usersThisMonth,
            chartData: {
                daily: last7Days,
                monthly: last6Months
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users list (protected route) - for table
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        const { count, rows } = await db.User.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
            order: [['id', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            users: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;