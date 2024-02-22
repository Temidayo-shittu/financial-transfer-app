const User = require("../../models/User");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res, next) => {
	try {
		const user = await User.find({}).select('-password -otp -resetToken -accountId');

		res.status(200).json({ status: "success", user });
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
	}
});

module.exports = { getAllUsers };