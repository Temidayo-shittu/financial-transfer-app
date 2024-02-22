const mongoose = require('mongoose');
const validator = require('validator');

const accountSchema = new mongoose.Schema(
	{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        account_name: {
			type: String,
		},
        account_number: {
			type: Number,
		},
        account_balance: {
			type: Number,
		},
        currency: {
			type: String,
		},
        account_type: {
			type: String,
			enum: ["Current", "Savings", "Domiciliary"],
			default: "",
		},
		status: {
			type: String,
			enum: ["Active", "Inactive"],
			default: "Active",
		},
        bank_name: {
			type: String,
		},
        amount: {
            type: String,
        },
        country: {
			type: String,
            default: "nigeria"
		},
        taxExempt: {
            type: Boolean,
            default: false,
        },
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("account", accountSchema);