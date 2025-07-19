const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Update user profile (protected route)
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check if email is already used by another user
        const existingUser = await db.User.findOne({
            where: {
                email,
                id: { [Op.ne]: userId } // Exclude current user
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Update user
        const [updatedRowsCount] = await db.User.update(
            { name, email },
            { where: { id: userId } }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get updated user data
        const updatedUser = await db.User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
        });

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password (protected route)
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.dataValues.id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        // Get user with password hash
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await db.User.update(
            { passwordHash: newPasswordHash },
            { where: { id: userId } }
        );

        res.json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;