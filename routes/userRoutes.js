const { Router } = require("express");
const { verifyAccessToken, verifyRole } = require("../middlewares/full-auth");
const { getAllUsers } = require("../controllers/users/getAllUsers");
const { getSingleUserDetails } = require("../controllers/users/getSingleUserDetails");
const { getCurrentlyLoggedInUser } = require("../controllers/users/getCurrentlyLoggedInUser");
const { updateUser } = require("../controllers/users/updateUser");
const { deleteUser } = require("../controllers/users/deleteUser");

const userRouter = Router();

// Admin level routes
userRouter.route("/profile").get(verifyAccessToken, verifyRole(["admin"]), getAllUsers);

// User level routes
userRouter.route("/profile/:id").get(verifyAccessToken, getSingleUserDetails);
userRouter.route("/profile/show/current-user").get(verifyAccessToken, getCurrentlyLoggedInUser);
userRouter.route("/profile/:id").put(verifyAccessToken, updateUser);
userRouter.route("/profile/:id").delete(verifyAccessToken, deleteUser);

module.exports = { userRouter };
