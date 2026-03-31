const config = {
    PORT : process.env.PORT || 8080,
    FRONTEND_URL : process.env.FRONTEND_URL,
    MONGODB_URL : process.env.MONGODB_URL,
    NODEMAILER_MAIL : process.env.NODEMAILER_MAIL,
    NODEMAIL_APP_PASSWORD : process.env.NODEMAIL_APP_PASSWORD,
    JWT_TOKEN_SECRET : process.env.JWT_TOKEN_SECRET,
    JWT_TOKEN_SIGNUP_MAIL_SECRET : process.env.JWT_TOKEN_SIGNUP_MAIL_SECRET,
    JWT_RESET_PASSWORD_SECRET : process.env.JWT_RESET_PASSWORD_SECRET,
}

module.exports  = config;