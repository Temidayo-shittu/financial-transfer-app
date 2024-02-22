const mongoose = require("mongoose");
const { config } = require("../config/global.config");

mongoose.connect(config.databaseURL, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

const database = mongoose.connection;

database.on(
	"error",
	console.error.bind(console, "❌  mongodb connection error"),
);

database.once("open", () => {
	if (process.env.NODE_ENV === "production") {
		console.log("✅ mongodb connected successfully in PRODUCTION mode");
	} else {
		console.log("✅ mongodb connected successfully in DEVELOPMENT mode");
	}
});

mongoose.Promise = Promise;

