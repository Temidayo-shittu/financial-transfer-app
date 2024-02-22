require('dotenv').config()
module.exports = {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
}