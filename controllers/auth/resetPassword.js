const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const User = require("../../models/User");

const resetPassword = async(req, res, next)=> {
    try {
        const { password, otp } = req.body;

        if (!otp) return res.status(406).json({ status: "fail", message: "Password has been reset or you sent an invalid otp" });

        const user = await User.findOne({ otp: otp });
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        if (!password) return res.status(406).json({ status: "fail", message: "Password enter new password" });

        let hashedPassword = await hashPassword(password);
        user.otp = "";
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ status: "success", message: "Password reset successfully, you can now login" });
        
    } catch(err) {
        console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
    }

};

module.exports = { resetPassword };