const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("../config/config");

const sendPasswordResetMail = async (user) => {
  try {
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      config.JWT_RESET_PASSWORD_SECRET,
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
      subject: "Password Reset Link",
      text: `You requested to reset your password. This link is valid for 5 minutes:\n\n${config.FRONTEND_URL}/update-password/${token}`,
      html: `
        <p>You requested to reset your password.</p>
        <p>This link is valid for <strong>5 minutes</strong>:</p>
        <a href="${config.FRONTEND_URL}/update-password/${token}">
          Reset Password
        </a>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (err) {
    throw err;
  }
};

module.exports = sendPasswordResetMail;