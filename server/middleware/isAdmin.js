const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.headers.userid || req.headers.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = isAdmin;
