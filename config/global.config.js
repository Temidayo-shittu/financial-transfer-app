const dotenv = require("dotenv");

dotenv.config();

let db_URI;
const access_time = 7200;    // 2 hours in seconds
const refresh_time = 86400;  // 24 hours in seconds

if (process.env.NODE_ENV === "production") {
	db_URI = process.env.LIVE_DB_URI;
} else {
	db_URI = process.env.LOCAL_DB_URI;
}

const config = {
	/**
	 * Your favorite port
	 */
	port: parseInt(process.env.PORT || 3000, 10),

	/**
	 * That long string from mongodb
	 */
	databaseURL: db_URI,

	api: {
		prefix: "/api/v1",
	},

	clientUrl: process.env.CLIENT_URL,

	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
	accessTokenExpiresIn: access_time,
	refreshTokenExpiresIn: refresh_time,

	mailUser: process.env.MAIL_USER,
	mailPass: process.env.MAIL_PASSWORD,
	mailClientId: process.env.MAIL_CLIENT_ID,
	mailClientSecret: process.env.MAIL_CLIENT_SECRET,
	mailRefreshToken: process.env.MAIL_REFRESH_TOKEN,

	recaptchaSecret: process.env.RECAPTCHA_SECRET,

	googleOauthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
	googleOauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	googleOauthCallbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,

	googleClientId: process.env.GOOGLE_CLIENT_ID,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET, 
	googleCallbackURL: process.env.GOOGLE_CALLBACK_URL, 

	cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

	paystackSecret: process.env.PAYSTACK_SECRET,
	paystackKey: process.env.PAYSTACK_KEY,
};

module.exports = { config };
