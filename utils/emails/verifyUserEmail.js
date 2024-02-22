const { sendEmail } = require("./sendEmail");
require('dotenv').config()

const verifyUserEmail = async (req, userName, email, otp) => {
	const capitalizedUserName =
		userName.charAt(0).toUpperCase() + userName.slice(1);
	const html = `Hello ${capitalizedUserName},
    <br/>
    <br>
    Thank you for your registration on AIRWAYS MONEY APP.
    <br/>
    <br/>
    <strong>${otp}</strong> is your verification code to continue your signup.
    <br><br>
    Cheers,
    <br>
    <strong>AIRWAYS MONEY APP</strong>.

    `;

	await sendEmail({
        from: process.env.MAIL_USER,
		to: email,
		subject: "AIRWAYS MONEY APP: Please activate your account",
		html: html,
    });
};

module.exports = { verifyUserEmail }