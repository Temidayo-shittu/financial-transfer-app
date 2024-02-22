console.log('E-Commerce API');
require("./config/passport.config");
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const { credentials } = require("./middlewares/credentials");
const { config } = require("./config/global.config");
const morgan = require("morgan");
const { AppError } = require("./utils/AppError");
const { globalErrorHandler } = require("./middlewares/error-handler");
const helmet = require("helmet");
const { userAuthRouter } = require("./routes/userAuthRoutes");
const { userRouter } = require("./routes/userRoutes");
const { accountRouter } = require("./routes/accountRoutes");
const { beneficiaryRouter } = require("./routes/beneficiaryRoutes");

const initExpress = ({ app }) => {
	app.use(credentials);
	app.use(helmet());
	// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	app.enable("trust proxy");

	const corsOptions = {
		Credentials: true,
	};
	app.options("*", cors(corsOptions));
	app.use(cors(corsOptions));

	// Development Logging
	app.use(morgan("dev"));

	// Middleware that transforms the raw string of req.body into json
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Load API routes
	app.get("/", (req, res) => res.send("API is up and running"));
	app.get("/api/v1", (req, res) =>
		res.send("Cross Borders Financial Transfers API V1, [Health check::: API up and running]"),
	);

	app.get("/", (req, res) => res.send("API is running"));
	app.use(`${config.api.prefix}/auth`, userAuthRouter);
	app.use(`${config.api.prefix}/user`, userRouter);
	app.use(`${config.api.prefix}/account`, accountRouter);
	app.use(`${config.api.prefix}/beneficiary`, beneficiaryRouter);
	
	// all runs for all http methods
	app.all("*", (req, res, next) => {
		next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
	});

	app.use(globalErrorHandler);
	app.use(passport.initialize());
};

module.exports = { initExpress };
