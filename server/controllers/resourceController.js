const Resource = require('../models/Resource');

exports.getResourcesBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const resources = await Resource.find({ subject: subjectId }).sort({ createdAt: -1 });
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
