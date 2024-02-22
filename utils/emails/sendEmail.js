const nodemailer = require('nodemailer')
const nodemailerConfig = require('../nodemailerConfig')
require('dotenv').config()

const sendEmail = async({from, to, subject, html})=>{
   let testAccount= await nodemailer.createTestAccount()
   const transporter = nodemailer.createTransport(nodemailerConfig);

return transporter.sendMail({
    from: process.env.MAIL_USER, // sender address
    to,
    subject,
    html
  });
}

module.exports = { sendEmail }