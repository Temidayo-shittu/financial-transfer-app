const { hashPassword } = require("../../utils/bcrypt");
const { welcomeEmail } = require("../../utils/emails/welcomeEmail");
const { userAge } = require("../../utils/getUserAge");
const { generateOTP } = require("../../utils/randomstring");
const User = require("../../models/User");

const signup = async (req, res, next) => {
    try{
        const { first_name, last_name, email, password, date_of_birth } = req.body;
        const userAlreadyExists = await User.findOne({ email: email });

		if (userAlreadyExists)
			return res.status(400).json({
				status: "fail",
				message: "User already exists with this email",
			});
           
		// Genrate otp
		let generatedOtp = generateOTP();

		const newUser = new User({
            ...req.body
		});
        newUser.password = await hashPassword(password);
        newUser.fullname = `${newUser.first_name} ${newUser.last_name}`;
        newUser.age = userAge(newUser.date_of_birth);
        newUser.otp = Number(generatedOtp);
        newUser.provider = "Local";

        await newUser.save();
        await welcomeEmail(req, newUser.first_name, newUser.email, generatedOtp);

		// let msg = `An OTP has been sent to for verification.`;
		let msg = `An OTP has been sent to ${newUser.email} for verification.`;

		return res.status(201).json({ status: "success", message: msg });

    } catch(err) {
        console.log("INTERNAL_SERVER_ERROR::", err.message);
		return res
			.status(500)
			.json({ status: "fail", message: "Internal server error", error: err.message });
    }
};

module.exports = { signup };