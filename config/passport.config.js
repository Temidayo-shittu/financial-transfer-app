const { comparePassword } = require("../utils/bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { config } = require("./global.config");
const User = require("../models/User");

passport.use(
	"local",
	new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email: email });

				if (!user) {
					return done(null, false, {
						message: `User with email: ${email} does not exist`,
					});
				}

				if (!user.verification_status) {
					return done(null, false, {
						message:
							"Your email is not yet verified! Please check your mail for an OTP or request a new one",
					});
				}

				const isMatch = await comparePassword(password, user.password);

				if (!isMatch) {
					return done(null, false, {
						message: "Password incorrect!",
					});
				}

				user.provider = "Local";
				await user.save();

				return done(null, user, { message: "Login successful!" });
			} catch (err) {
				return done(err);
			}
		},
	),
);

passport.use(
	new GoogleStrategy(
		{
			callbackURL: config.googleCallbackURL,
			clientID: config.googleClientId,
			clientSecret: config.googleClientSecret,
			userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
		},
		async (accessToken, refreshToken, profile, done) => {
			const id = profile.id;
			const email = profile.emails[0].value;
			const first_name = profile.name.givenName;
			const last_name = profile.name.familyName;
			const profilePhoto = profile.photos[0].value;

			try {
				let user = await User.findOne({ email: email });

				if (!user) {
					const newUser = new User({
						accountId: id,
						email: email,
						first_name: first_name,
						last_name: last_name,
						fullname: `${first_name} ${last_name}`,
						provider: "Google",
						verified: true,
					});
					newUser.avatar.url = profilePhoto;
					await newUser.save();
					return done(null, newUser);
				}

				user.provider = "Google";
				await user.save();
				return done(null, user, { message: "Login successful!" });
			} catch (err) {
				console.error(err);
				return done(err);
			}
		},
	),
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.accessTokenSecret,
		},
		async function (jwtPayload, done) {
			return await User.findOne({ email: jwtPayload.email })
				.then((user) => {
					return done(null, user);
				})
				.catch((err) => {
					return done(err);
				});
		},
	),
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (user, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});
