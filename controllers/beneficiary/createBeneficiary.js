const User = require("../../models/User");
const Beneficiary = require("../../models/Beneficiary");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { isValidCurrencySymbol } = require("../../utils/validCurrencySymbol");
const { generateAccountNumber } = require("../../utils/randomstring");
const { checkPermissions } = require("../../utils/checkPermissions");

const createBeneficiary = catchAsync(async (req, res, next) => {
	const userId = req.user.id;
	const findUser = await User.findOne({ _id: userId });
	if (!findUser) {
		return res.status(400).json({
			status: "Fail",
			message: "User not found",
		});
	}

	try {
		const { currency, ...beneficiaryData } = req.body;

        // Validate currency symbol
        if (!isValidCurrencySymbol(currency)) {
            return res.status(400).json({
                status: "Fail",
                message: "Invalid currency symbol",
            });
        }
		const beneficiary = new Beneficiary({ currency, ...beneficiaryData });

		beneficiary.user = userId;
		beneficiary.account_number  = generateAccountNumber();
        beneficiary.amount = `${currency}${beneficiary.starting_balance}`;

		await beneficiary.save();
        //await accountEmail(req, findUser.first_name, findUser.email, account.bank_name, account.account_number, account.account_name, account.amount);

		let msg = `Hi ${findUser.first_name}, You Successfully Created an account with ${account.bank_name}!! Check your email for your bank details.`;

		res.status(201).json({
			status: "success",
			message: `Hi ${findUser.first_name}, You Successfully Created a profile for a Beneficiary named: ${beneficiary.fullname}!!`,
            beneficiary
		});
	} catch (err) {
		console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res.status(500).json({
			status: "fail",
			message: "Internal server error",
			error: err.message,
		});
	}
});

module.exports = { createBeneficiary };