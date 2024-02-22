const { generateOTP } = require("../../utils/randomstring");
const { resetEmail } = require("../../utils/emails/resetEmail");
const User = require("../../models/User");

const resendOtp = async (req, res, next) => {
    try{
        const userId = req.userId;
        const { email } = req.body;
        //const newVal = email.toLowerCase();

        if(!email) return res.status(406).json({ status: "fail", message: "Please enter your email" });

        const user = await User.findOne({  $or: [{ _id: userId }, { email: email }], });

		if (!user)
			return res.status(404).json({ status: "fail", message: "User not found" });

            user.otp = await generateOTP();
            await user.save();
    
            await resetEmail(req, '', user.email, user.otp);

		return res.status(200).json({ status: "success", message: "A new OTP has been sent to your email" });

    } catch(err) {
        console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
    }
};

module.exports = { resendOtp };