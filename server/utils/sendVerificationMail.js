const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("../config/config");

async function sendVerificationMail(user) {
    if (!user) throw new Error("User not provided");
    if (!user.email) throw new Error("User email missing");

    const token = jwt.sign(
        { user_id: user._id, email: user.email },
        config.JWT_TOKEN_SIGNUP_MAIL_SECRET,
        { expiresIn: "5m" }
    );

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: config.NODEMAILER_MAIL,
            pass: config.NODEMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"evalio" <${config.NODEMAILER_MAIL}>`,
        to: user.email,
        subject: "Email Verification Link",
        html: `
            <h3>Email Verification</h3>
            <p>Click the button below to verify your email:</p>
            <a href="${config.FRONTEND_URL}/verify-email/${token}"
               style="display:inline-block;padding:10px 20px;
               background:#000814;color:#fff;text-decoration:none;
               border-radius:5px;">
               Verify Email
            </a>
            <p>Or copy this link:</p>
            <p>${config.FRONTEND_URL}/verify-email/${token}</p>
            <p><b>Note:</b> Link valid for 5 minutes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationMail;