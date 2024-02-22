const User = require("../../models/User");
const Beneficiary = require("../../models/Beneficiary");
const { AppError } = require("../../utils/AppError");
const { catchAsync } = require("../../utils/catchAsync");
const { isValidCurrencySymbol } = require("../../utils/validCurrencySymbol");
const { generateAccountNumber } = require("../../utils/randomstring");
const { checkPermissions } = require("../../utils/checkPermissions");

const getAllBeneficiaries = catchAsync(async (req, res, next) => {
	const beneficiaryCount = await Beneficiary.countDocuments();
	const resultPerPage = parseInt(req.query.limit) || beneficiaryCount;
	const page = parseInt(req.query.page) || 1;

	try {
		const apiFeature = new ApiFeatures(
			Beneficiary.find({}).populate("user", "fullname email phone_number country"),
			req.query,
		)
			.search()
			.filter()
			.pagination(resultPerPage);

		const beneficiaries = await apiFeature.executeQuery();
		const filteredBeneficiaryCount = beneficiaries.length;

		if (beneficiaries.length === 0) {
			return res.status(200).json({
				status: "success",
				message: "No Beneficiary Found",
			});
		};

        let totalValues = [];

		const pipeline = [
			{
				$group: {
					_id: null,
					totalValues: { $sum: "$value" },
				},
			},
		];

        // Optional: Filter by bank_name
		if (req.query.bank_name) {
			pipeline.unshift({
				$match: { bank_name: req.query.bank_name },
			});
		};

		// Optional: Filter by account_type
		if (req.query.account_type) {
			pipeline.unshift({
				$match: { account_type: req.query.account_type },
			});
		};

		res.status(200).json({
			status: "success",
			data: beneficiaries,
			beneficiaryCount,
			filteredBeneficiaryCount,
			page,
			resultPerPage,
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

module.exports = { getAllBeneficiaries };
