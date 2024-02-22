const User = require("../../models/User");
const RefreshToken = require("../../models/UserRefreshToken");
const { config } = require("../../config/global.config");
const { signAccessToken, signRefreshToken } = require("../../middlewares/full-auth");
const { AppError } = require("../../utils/AppError");
const { getGoogleOauthToken, getGoogleUser } = require("../../utils/googleOauth");

const googleOauthHandler = async (req, res, next) => {
	try {
		const code = req.query.code;
		const pathUrl = req.query.state || "/";

		if (!code) {
			return next(new AppError("Authorization code not provided!", 401));
		}

		const { id_token, access_token } = await getGoogleOauthToken({ code });

		const { name, verified_email, email, picture } = await getGoogleUser({
			id_token,
			access_token,
		});

		if (!verified_email) {
			return next(new AppError("Google account not verified", 403));
		}

		const user = await User.findOneAndUpdate(
			{ email },
			{
				name,
				avatar: { url: picture },
				email,
				provider: "Google",
				verified: true,
			},
			{ upsert: true, runValidators: false, new: true, lean: true },
		);

		if (!user) {
			return res.redirect(`${config.clientUrl}/oauth/error`);
		}

		const payload = {
			role: user.role,
			email: user.email,
			id: user._id,
			fullname: `${user.first_name} ${user.last_name}`,
			first_name: user.first_name,
			last_name: user.last_name,
		};

		const accessToken = await signAccessToken(payload);		
		const refreshToken = await RefreshToken.createRefreshToken(user);

		const { password, otp, resetToken, accountId, ...userData } = user.toObject();
		const extraData = { userData };

		const redirectUrl = new URL(`${config.clientUrl}${pathUrl}`);
		redirectUrl.searchParams.set("access_token", accessToken);
		redirectUrl.searchParams.set("refresh_token", refreshToken);
		redirectUrl.searchParams.set("logged_in", true);

		// Add the additional data to the redirect URL
		for (const [key, value] of Object.entries(extraData)) {
			redirectUrl.searchParams.set(key, value);
		}

		res.redirect(redirectUrl.toString());
	} catch (err) {
		console.log("Failed to authorize Google User", err);
		return res.redirect(`${config.clientUrl}/oauth/error`);
	}
};

module.exports = { googleOauthHandler };
