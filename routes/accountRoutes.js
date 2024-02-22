const { Router } = require("express");
const { verifyAccessToken, verifyRole } = require("../middlewares/full-auth");
const { createUserAccount } = require("../controllers/account/createUserAccount");
const { getAllUserAccounts } = require("../controllers/account/getAllUsersAccount");
const { getSingleUserAccount } = require("../controllers/account/getSingleUserAccount");
const { currentlyLoggedUserAccount } = require("../controllers/account/showCurrentlyLoggedUserAcc");

const accountRouter = Router();

// Admin level routes
accountRouter.route("/profile").get(verifyAccessToken, verifyRole(["admin"]), getAllUserAccounts);

// User level routes
accountRouter.route("/profile").post(verifyAccessToken, createUserAccount);
accountRouter.route("/profile/:id").get(verifyAccessToken, getSingleUserAccount);
accountRouter.route("/profile/show/current-user").get(verifyAccessToken, currentlyLoggedUserAccount);
//userRouter.route("/profile/:id").delete(verifyAccessToken, deleteUser);

module.exports = { accountRouter };