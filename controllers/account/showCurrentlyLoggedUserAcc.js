const User = require("../../models/User");
const Account = require("../../models/Account");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { checkPermissions } = require("../../utils/checkPermissions");

const currentlyLoggedUserAccount = catchAsync(async (req, res, next) => {
	try {
		const account = await Account.findOne({ user: req.userId }).populate("user", "fullname email phone_number country");
        if (!account) {
			return next(
				new AppError(`User with the given ID: ${req.userId} is yet to create a bank account`, 400),
			);
		};

		res.status(200).json({ status: "success", account });
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
	}
});

module.exports = { currentlyLoggedUserAccount };