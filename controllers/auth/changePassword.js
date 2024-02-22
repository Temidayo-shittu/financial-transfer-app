const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const User = require("../../models/User");

const changePassword = async(req, res, next)=> {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!oldPassword || !newPassword) return res.status(406).json({ status: "fail", message: "Please provide both old and new password" });

        const user = await User.findOne({_id:userId});
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        const isPasswordCorrect = await comparePassword(oldPassword, user.password);
        if (!isPasswordCorrect) return res.status(401).json({ status: "fail", message: "Old password is incorrect!! Please input correct password" });

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ status: "success", message: "Password changed successfully" });
        
    } catch(err) {
        console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
    }

};

module.exports = { changePassword };