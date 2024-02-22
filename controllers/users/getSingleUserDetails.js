const User = require("../../models/User");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { checkPermissions } = require("../../utils/checkPermissions");

const getSingleUserDetails = catchAsync(async (req, res, next) => {
	try {
        const { id:userId } = req.params;
		const user = await User.findById(userId).select('-password -otp -resetToken -accountId');
        if (!user) {
			return next(
				new AppError(`User does not exist with Id: ${userId}`, 400),
			);
		};
        checkPermissions(req.user, user._id);
		console.log(req.user.role, req.user.id, user._id)

		res.status(200).json({ status: "success", user });
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
	}
});

module.exports = { getSingleUserDetails };