const User = require('../models/User');
const sendVerificationMail = require('../utils/sendVerificationMail');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        const { name, username, email, password,confirm_password, year, role } = req.body;
        if(!name || !username || !email || !password || !confirm_password || !year || !role ) {
            return res.status(400).send({
                message : "All fields are required"
            })
        }

        if(password != confirm_password){
            return res.status(400).send({message : "Password Doesn't Match"});
        }

        const existing = await User.findOneAndDelete({
            email,
            isVerified: false
        });

        const user = new User({
            name : name,
            username : username,
            email : email,
            password : password,
            study_year : year,
            role : role,
        })

        await user.save();
        await sendVerificationMail(user);
        return res.status(200).send({
            message : "signup successful"
        })

    } catch(err) {
        res.status(400).send({error : err.message});
    }
}

exports.login = async (req, res) => {
    try {
        const { email,password } = req.body;

        if(!email || !password) return res.status(400).send({
            message : "All fields are required"
        })

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        
        if (!user.isVerified) {
            await sendVerificationMail(user);
            return res.status(401).send({ message : "user is not verified. Check your inbox for verification mail" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ user_id: user._id },config.JWT_TOKEN_SECRET, { expiresIn: '30d' });

        res.status(200).send({
            token: token,
            username: user.name,
            user_id : user._id
        });

    }catch(err) {
        res.status(400).send({error : err.message});
    }
}

exports.verifyMail = async(req, res) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(token, config.JWT_TOKEN_SIGNUP_MAIL_SECRET);
        if (!decoded) res.status(400).send({ message: "Invalid Token" });

        const user = await User.findById(decoded.user_id);
        if (!user) return res.status(400).send({ message: "Invalid Token" });

        if(user.isVerified) return res.status(200).send({ message: "User is already verified" })
        user.isVerified = true;

        await user.save();
        res.status(200).send({ message: "User has been verified" });

    }catch(err) {
        res.status(500).send(err);
    }
}