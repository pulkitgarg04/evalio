const Subject = require('../models/Subject');
const Test = require('../models/Test');
const Question = require('../models/Question');

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
        const query = {};

        if (year) {
            query.year = parseInt(year, 10);
        }

        const subjects = await Subject.find(query).sort({ name: 1 }).lean();

        // For each subject, we are counting the no. of tests and questions associated
        const subjectsWithCounts = await Promise.all(
            subjects.map(async (subject) => ({
                ...subject,
                testCount: await Test.countDocuments({ subject: subject.name }),
                questionCount: await Question.countDocuments({ subject: subject.name })
            }))
        );

        res.status(200).json(subjectsWithCounts);
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
