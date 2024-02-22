const User = require("../../models/User");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");

const deleteUser = catchAsync(async (req, res, next) => {
	try {
        const { id:userId } = req.params;
		const user = await User.findById(userId);
		if (!user) {
			return next(
				new AppError(`User does not exist with Id: ${userId}`, 400),
			);
		};
		const imageId = user.avatar.public_id;

		await uploader.destroy(imageId);

		await user.deleteOne();

		res.status(201).json({
			status: "success",
			message: "User account deleted successfully",
		});
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({
				status: "fail",
				message: "Internal server error",
				error: err.message,
			});
	}
});

module.exports = { deleteUser };