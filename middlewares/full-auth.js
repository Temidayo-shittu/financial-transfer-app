const JWT = require("jsonwebtoken");
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");
const { config } = require("../config/global.config");

const { TokenExpiredError } = JWT;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(401).json({
			message: "Session expired, Please login to continue",
			data: null,
		});
	}

	return res.status(401).json({
		message: "Unauthorized!",
		data: null,
	});
};

const signAccessToken = (userData) => {
	return new Promise((resolve, reject) => {
		const payload = userData;
		const secret = config.accessTokenSecret;
		JWT.sign(
			payload,
			secret,
			{ expiresIn: config.accessTokenExpiresIn },
			(err, token) => {
				if (err) {
					console.log(err.message);
					reject(err);
					return;
				}
				resolve(token);
			},
		);
	});
};

const signRefreshToken = (userData) => {
	return new Promise((resolve, reject) => {
		const payload = userData;
		const secret = config.refreshTokenSecret;
		JWT.sign(payload, secret, (err, token) => {
			if (err) {
				console.log(err);
				reject(err);
				return;
			}
			resolve(token);
		});
	});
};

const verifyRefreshToken = async (token) => {
	return await JWT.verify(token, config.refreshTokenSecret);
};

const verifyAccessToken = catchAsync(async (req, res, next) => {
	const authHeader =
		req.headers["Authorization"] ||
		req.headers["authorization"] ||
		req.headers["x-access-token"] ||
		req.headers["access-token"];
	if (!authHeader || !authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({
			mesage: "Unauthorized access, Please login to continue",
			data: null,
		});
	}
	const bearerToken = authHeader.split(" ")[1];
	await JWT.verify(bearerToken, config.accessTokenSecret, (err, payload) => {
		if (err) {
			let message;
			if (err.name === "JsonWebTokenError") {
				message = "Unauthorized!! Try to login afresh";
			}
			if (err.message === "jwt expired") {
				message = "Session Expired, Please login to continue";
			}
			return res.status(401).json({ message: message, data: null });
		}
		req.userId = payload.id;
		req.user = payload;
		next();
	});
});

const verifyRole = (allowedRoles) => {
	return catchAsync(async (req, res, next) => {
		const authHeader =
			req.headers["Authorization"] ||
			req.headers["authorization"] ||
			req.headers["x-access-token"];
		if (!authHeader || !authHeader?.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Unauthorized, Please log in", data: null });
		}

		const bearerToken = authHeader.split(" ")[1];
		await JWT.verify(bearerToken, config.accessTokenSecret, (err, payload) => {
			if (err) {
				let message;
				if (err.name === "JsonWebTokenError") {
					message = "Unauthorized!";
				}
				if (err.message === "jwt expired") {
					message = "Session Expired, Please log in to continue";
				}
				return res.status(401).json({ message: message, data: null });
			}

			if (allowedRoles.includes(payload.role)) {
				req.userId = payload.id;
				req.user = payload;
				next();
			} else {
				const message = `Unauthorized, requires ${allowedRoles.join(
					"/",
				)} permission`;
				return res.status(401).json({ message: message, data: null });
			}
		});
	});
};

module.exports = {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
	verifyAccessToken,
	verifyRole,
};
