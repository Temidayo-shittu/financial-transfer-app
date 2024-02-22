const { Router } = require("express");
const { verifyAccessToken, verifyRole } = require("../middlewares/full-auth");
const { createBeneficiary } = require("../controllers/beneficiary/createBeneficiary");
const { getAllBeneficiaries } = require("../controllers/beneficiary/getAllBeneficiaries");
const { getSingleBeneficiary } = require("../controllers/beneficiary/getSingleBeneficiary");
const { currentlyLoggedUserBeneficiary } = require("../controllers/beneficiary/showCurrentlyLoggedUserBeneficiary");

const beneficiaryRouter = Router();

// Admin level routes
beneficiaryRouter.route("/profile").get(verifyAccessToken, verifyRole(["admin"]), getAllBeneficiaries);

// User level routes
beneficiaryRouter.route("/profile").post(verifyAccessToken, createBeneficiary);
beneficiaryRouter.route("/profile/:id").get(verifyAccessToken, getSingleBeneficiary);
beneficiaryRouter.route("/profile/show/current-user").get(verifyAccessToken, currentlyLoggedUserBeneficiary);

module.exports = { beneficiaryRouter };