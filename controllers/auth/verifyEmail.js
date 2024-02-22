const { generateOTP } = require("../../utils/randomstring");
const User = require("../../models/User");

const verifyEmail = async (req, res, next) => {
	try {
		const user_otp = req.body.token || req.query.otp;

		if (!user_otp)
			return res
				.status(406)
				.json({ status: "fail", message: "Verification token is required" });

		const user = await User.findOne({ otp: user_otp });

		if (!user)
			return res.status(400).json({
				status: "fail",
				message: "Invalid token, please check your email for a valid one",
			});

		user.verification_status = "verified";

		const updatedUser = await user.save();

		if (!updatedUser)
			return res.status(400).json({
				status: "fail",
				message: "Could not verify email, something went wrong",
			});

		return res
			.status(200)
			.json({ 
                status: "success", 
                message: `Hi ${updatedUser.first_name},,Your Account has been successfully verified!! `
             });
	} catch (err) {
		return res.status(500).json({ status: "success", message: err.message });
	}
};

module.exports = { verifyEmail };