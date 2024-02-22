const randomstring = require("randomstring");

const generateOTP = () => {
	const otp = randomstring.generate({
		length: 6,
		charset: "numeric",
	});
	return otp.padStart(6, "0");
};

// temporary password generator
const generateTempPass = () => {
	const otp = randomstring.generate({
		length: 8,
		charset: "alphanumeric",
	});
	return otp.padStart(8, "0");
};

const generateAccountNumber = () => {
	const suffix = randomstring.generate({
		length: 10,
		charset: "numeric",
	});
	const id = suffix.padStart(10, "0");

	return id;
};

const transactionReference = () => { 
	const prefix = "ebi-trnx-";
	const suffix = Date.now();
	const ref = prefix + suffix;
	return ref;
 }

const randomReferenceNumber = (prefix, len) => {
	const suffix = randomstring.generate({
		length: Number(len),
		charset: "numeric",
	});
	const id = prefix + suffix.padStart(Number(len), "0");

	return id;
};

module.exports = {
	generateOTP,
	randomReferenceNumber,
	generateAccountNumber,
	generateTempPass,
	transactionReference,
};
 