const mongoose = require('mongoose');
const validator = require('validator');

const beneficiarySchema = new mongoose.Schema(
	{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        fullname: {
			type: String,
		},
        email: {
			type: String,
		},
        phone_number: {
			type: String,
		},
        account_number: {
			type: Number,
		},
        account_name: {
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
        starting_balance: {
            type: Number,
            default: 0
        },
        currency: {
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

module.exports = mongoose.model("beneficiary", beneficiarySchema);