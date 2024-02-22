const { config } = require("../config/global.config");
const axios = require("axios");
const qs = require("qs");
const { AppError } = require("./AppError");

const getGoogleOauthToken = async ({ code }) => {
	const rootURL = "https://oauth2.googleapis.com/token";

	const options = {
		code,
		client_id: config.googleOauthClientId,
		client_secret: config.googleOauthClientSecret,
		redirect_uri: config.googleOauthCallbackURL,
		grant_type: "authorization_code",
	};

	try {
		const { data } = await axios.post(rootURL, qs.stringify(options), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return data;
	} catch (err) {
		console.log("GOOGLE_OAUTH_ERR", err.message);
		throw new AppError("Failed to fetch Google OAuth Tokens", 500);
	}
};

const getGoogleUser = async ({ id_token, access_token }) => {
	try {
		const { data } = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
			{
				headers: {
					Authorization: `Bearer ${id_token}`,
				},
			},
		);

		return data;
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
};

module.exports = { getGoogleOauthToken, getGoogleUser };
