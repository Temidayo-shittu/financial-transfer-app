const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const User = require("../../models/User");
const { generateOTP } = require("../../utils/randomString");
const { resetEmail } = require("../../utils/emails/resetEmail");

const forgotPassword = async(req, res, next)=> {
    try {
        const { email } = req.body;
       // const newValue = email.toLowerCase();

        if (!email) return res.status(406).json({ status: "fail", message: "Please provide email" });

        const user = await User.findOne({ email:email });
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        user.otp = await generateOTP();
        await user.save();

        await resetEmail(req, '', user.email, user.otp);

        return res.status(200).json({ status: "success", message: `Password reset details have been sent to ${user.email}` });
        
    } catch(err) {
        console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
    }

};

module.exports = { forgotPassword };