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

    const verificationLink = `${config.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
        from: `"Evalio" <${config.NODEMAILER_MAIL}>`,
        to: user.email,
        subject: "Evalio - Email Verification Link!",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333333; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eeeeee; }
                    .header h1 { margin: 0; font-size: 24px; color: #000814; }
                    .content { padding: 20px; text-align: center; }
                    .button { display: inline-block; padding: 12px 24px; background-color: #000814; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; }
                    .button:hover { background-color: #001d3d; }
                    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666; }
                    .note { font-size: 14px; margin-top: 20px; }
                    @media only screen and (max-width: 600px) {
                        .container { padding: 10px; }
                        .button { width: 100%; box-sizing: border-box; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Evalio</h1>
                    </div>
                    <div class="content">
                        <h2>Email Verification</h2>
                        <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.</p>
                        <a href="${verificationLink}" class="button">Verify Email</a>
                        <p class="note">Or copy and paste this link into your browser:<br><a href="${verificationLink}" style="color: #000814;">${verificationLink}</a></p>
                        <p class="note"><b>Note:</b> This link is valid for 5 minutes. If you didn't request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Evalio. All rights reserved.</p>
                        <p>If you have any questions, contact us at <a href="mailto:${config.NODEMAILER_MAIL}" style="color: #000814;">${config.NODEMAILER_MAIL}</a></p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationMail;