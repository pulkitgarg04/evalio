const User = require('../models/User');

exports.profileInfo = async (req,res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send({ message: "User not found"});
        }

        res.status(200).send({
            name: user.name,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            role: user.role,
            study_year: user.study_year
        });

    } catch (err) {
        res.status(500).send(err);
    }
}