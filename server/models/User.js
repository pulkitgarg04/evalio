const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('please provide valid email');
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength : 8,
        validate(value) {
            if (!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })) {
                throw new Error("Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one symbol.");
            }
        }
    },
    createdAt : {
        type : Date,
        default : Date.now,
        immutable : true,
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    study_year: {
        type: Number,
        default : 1
    },
})

userSchema.pre('save',async function () {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;