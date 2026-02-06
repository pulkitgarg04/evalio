const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
    try {
        const { name, year } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Subject name is required' });
        }

        const existingSubject = await Subject.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingSubject) {
            return res.status(400).json({ error: 'Subject already exists' });
        }

        const subject = new Subject({ name, year: year || 1 });
        await subject.save();

        res.status(201).json({ message: 'Subject created successfully', subject });
    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const { year } = req.query;
        let pipeline = [];

        if (year) {
            pipeline.push({ $match: { year: parseInt(year) } });
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'tests',
                    localField: 'name',
                    foreignField: 'subject',
                    as: 'tests'
                }
            },
            {
                $addFields: {
                    testCount: { $size: '$tests' }
                }
            },
            {
                $project: {
                    tests: 0
                }
            },
            {
                $sort: { name: 1 }
            }
        );

        const subjects = await Subject.aggregate(pipeline);
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByIdAndDelete(id);

        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
