const User = require("../../models/User");
const Beneficiary = require("../../models/Beneficiary");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { isValidCurrencySymbol } = require("../../utils/validCurrencySymbol");
const { generateAccountNumber } = require("../../utils/randomstring");
const { checkPermissions } = require("../../utils/checkPermissions");

const currentlyLoggedUserBeneficiary = catchAsync(async (req, res, next) => {
	try {
		const beneficiary = await Beneficiary.findOne({ user: req.userId }).populate("user", "fullname email phone_number country");
        if (!beneficiary) {
			return next(
				new AppError(`User with the given ID: ${req.userId} is yet to create a profile for his beneficiary`, 400),
			);
		};

		res.status(200).json({ status: "success", beneficiary });
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
	}
});

module.exports = { currentlyLoggedUserBeneficiary };