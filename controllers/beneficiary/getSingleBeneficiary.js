const User = require("../../models/User");
const Beneficiary = require("../../models/Beneficiary");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { isValidCurrencySymbol } = require("../../utils/validCurrencySymbol");
const { generateAccountNumber } = require("../../utils/randomstring");
const { checkPermissions } = require("../../utils/checkPermissions");

const getSingleBeneficiary = catchAsync(async (req, res, next) => {

	const { id:benficiaryId } = req.params;
	const beneficiary = await Beneficiary.findOne({ _id: benficiaryId }).populate("user", "fullname email phone_number country");

	try {
		if (!beneficiary) {
			return next(new AppError("Beneficiary not found", 404));
		};
		
        checkPermissions(req.user, beneficiary.user._id);
		console.log(req.user.id, beneficiary.user._id)

		res.status(200).json({
			status: "success",
			data: beneficiary,
		});
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error" });
	}
});

module.exports = { getSingleBeneficiary };