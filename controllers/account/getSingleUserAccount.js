const User = require("../../models/User");
const Account = require("../../models/Account");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { checkPermissions } = require("../../utils/checkPermissions");

const getSingleUserAccount = catchAsync(async (req, res, next) => {

	const { id:accountId } = req.params;
	const account = await Account.findOne({ _id: accountId }).populate("user", "fullname email phone_number country");

	try {
		if (!account) {
			return next(new AppError("Account not found", 404));
		};
		console.log(account, account.user._id)
        checkPermissions(req.user, account.user._id);
		console.log(req.user.id, account.user._id)

		res.status(200).json({
			status: "success",
			data: account,
		});
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error" });
	}
});

module.exports = { getSingleUserAccount };