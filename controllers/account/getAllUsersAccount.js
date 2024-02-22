const User = require("../../models/User");
const Account = require("../../models/Account");
const { AppError } = require("../../utils/AppError");
const { ApiFeatures } = require("../../utils/apifeature");
const { catchAsync } = require("../../utils/catchAsync");
const { checkPermissions } = require("../../utils/checkPermissions");

const getAllUserAccounts = catchAsync(async (req, res, next) => {
	const accountCount = await Account.countDocuments();
	const resultPerPage = parseInt(req.query.limit) || accountCount;
	const page = parseInt(req.query.page) || 1;

	try {
		const apiFeature = new ApiFeatures(
			Account.find({}).populate("user", "fullname email phone_number country"),
			req.query,
		)
			.search()
			.filter()
			.pagination(resultPerPage);

		const accounts = await apiFeature.executeQuery();
		const filteredAccountCount = accounts.length;

		if (accounts.length === 0) {
			return res.status(200).json({
				status: "success",
				message: "No Account Found",
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
			data: accounts,
			accountCount,
			filteredAccountCount,
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

module.exports = { getAllUserAccounts };
