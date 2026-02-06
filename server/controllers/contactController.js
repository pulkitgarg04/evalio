const Contact = require('../models/Contact');
const User = require('../models/User');

exports.createContact = async (req, res) => {
    try {
        const { subject, message, userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newContact = new Contact({
            userId,
            name: user.username,
            email: user.email,
            subject,
            message
        });

        await newContact.save();

        res.status(201).json({ message: 'Message sent successfully', contact: newContact });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
