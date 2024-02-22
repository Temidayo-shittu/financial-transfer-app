const { sendEmail } = require("./sendEmail");
require('dotenv').config()

const resetEmail = async (req, userName, email, otp) => {
	const capitalizedUserName =
		userName.charAt(0).toUpperCase() + userName.slice(1);
	const html = `Hello ${capitalizedUserName},
    <br/>
    <br>
    You are receiving this mail because you or someone else requested for a password change. <br>
    <br>
    <p> Please use this otp to Reset your password: <strong>${otp}</strong><br></p>
    <br/>
    If you did not make such request, please ignore this mail and your password will remain unchanged.
    <br/>
    <br><br>
    Kind Regards,
    <br>
    <br>
   <strong>AIRWAYS MONEY APP</strong>.

    `;

	await sendEmail({
        from: process.env.MAIL_USER, 
        to: email, 
        subject: 'AIRWAYS MONEY APP: Password reset', 
        html: html
    });
};

module.exports = { resetEmail }