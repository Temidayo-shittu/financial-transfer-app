const { Router } = require("express");
const passport = require("passport");
const User = require("../models/User");
const RefreshToken = require("../models/UserRefreshToken");
const { config } = require("../config/global.config");
const { signAccessToken, signRefreshToken, verifyAccessToken } = require("../middlewares/full-auth");
const { signup } = require("../controllers/auth/signup");
const { changePassword } = require("../controllers/auth/changePassword");
const { forgotPassword } = require("../controllers/auth/forgotPassword");
const { verifyEmail } = require("../controllers/auth/verifyEmail");
const { refreshToken } = require("../controllers/auth/refreshToken");
const { resetPassword } = require("../controllers/auth/resetPassword");
const { resendOtp } = require("../controllers/auth/resendOtp");
const { sendOtp } = require("../controllers/auth/sendOtp");
const { logout } = require("../controllers/auth/logout");
//const { upload } = require("../config/multerImage.config");
const { googleOauthHandler } = require("../controllers/auth/googleOauth");

const userAuthRouter = Router();

userAuthRouter.route("/signup").post(signup);
userAuthRouter.route("/oauth/google").get(googleOauthHandler);

userAuthRouter.route("/reset/password").post(resetPassword);
userAuthRouter.route("/forgot/password").post(forgotPassword);
userAuthRouter.route("/verify/email").post(verifyEmail);
userAuthRouter.route("/resend/otp").post(resendOtp);
userAuthRouter.route("/validate/otp").post(sendOtp);

userAuthRouter.route("/refresh/token").post(
	passport.authenticate("jwt", { session: false }),
	refreshToken,
);
userAuthRouter.route("/change/password").patch(
	passport.authenticate("jwt", { session: false }),
	verifyAccessToken,
	changePassword,
);
userAuthRouter.route("/logout").get(
	passport.authenticate("jwt", { session: false }),
	verifyAccessToken,
	logout,
);

// Passport stuffs
userAuthRouter.route('/login').post(async (req, res, next) => {
	passport.authenticate('local', { session: false }, async (err, user, info) => {
	  try {
		if (err || !user) {
		  return res.status(400).json({
			status: 'fail',
			message: info.message,
			error: err,
		  });
		}
  
		req.login(user, { session: false }, async (loginErr) => {
		  if (loginErr) {
			return res.status(400).json({
			  status: 'fail',
			  message: loginErr,
			});
		  }
  
		  const payload = {
			role: user.role,
			email: user.email,
			id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			fullname: `${user.first_name} ${user.last_name}`,
		  };
  
		  const accessToken = await signAccessToken(payload);
		  const refreshToken = await RefreshToken.createRefreshToken(user._id);
  
		  const { password, otp, resetToken, accountId, ...userData } = user.toObject();
		  return res.status(200).json({
			status: 'success',
			message: info.message,
			user: userData,
			access_token: accessToken,
			refresh_token: refreshToken,
		  });
		});
	  } catch (error) {
		next(error); // Make sure to handle any error using next
	  }
	})(req, res, next);
  });

userAuthRouter.route("/passport/google").get(passport.authenticate("google", { scope: ["profile"] }));

userAuthRouter.route("/passport/google/callback").get(
	passport.authenticate("google", { session: false }),
	async (req, res, next) => {
		try {
			if (!req.user) {
				return res.status(401).json({
					status: "success",
					message: "User not authenticated",
				});
			}
			const payload = {
				role: user.role,
				email: user.email,
				id: user._id,
				first_name: user.first_name,
				last_name: user.last_name,
				fullname: `${user.first_name} ${user.last_name}`,
			};

			const accessToken = await signAccessToken(payload);
			const refreshToken = await RefreshToken.createRefreshToken(user._id);

			const { password, otp, resetToken, accountId, ...userData } = req.user._doc;

			return res.status(201).json({
				status: "success",
				user: userData,
				access_token: accessToken,
				refresh_token: refreshToken,
			});
		} catch (err) {
			next(err);
		}
	},
);

module.exports = { userAuthRouter }