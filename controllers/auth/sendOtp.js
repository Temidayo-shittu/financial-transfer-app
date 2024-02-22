const { generateOTP } = require("../../utils/randomstring");
const User = require("../../models/User");

const sendOtp = async (req, res, next) => {
    try{
        const otp = req.body.otp || req.query.otp;
        if(!otp) return res.status(406).json({
            status: "fail",
			message: "Please enter recent OTP sent to your email",
        });

        const user = await User.findOne({ otp: otp });

		if (!user)
			return res.status(406).json({ status: "fail", message: "Invalid OTP" });

		return res.status(200).json({
			status: "success",
			message: "OTP is valid",
		});

    } catch(err) {
        console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
    }
};

module.exports = { sendOtp };