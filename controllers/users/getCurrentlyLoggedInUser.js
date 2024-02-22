const User = require("../../models/User");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { checkPermissions } = require("../../utils/checkPermissions");

const getCurrentlyLoggedInUser = catchAsync(async (req, res, next) => {
	try {
		const user = await User.findOne({ id: req.userId });
        if (!user) {
			return next(
				new AppError(`User does not exist with Id: ${userId}`, 400),
			);
		};

		const { password, otp, resetToken, accountId, ...userData } = user._doc;

		res.status(200).json({
			status: "success",
			user: userData,
		});
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
	}
});

module.exports = { getCurrentlyLoggedInUser };