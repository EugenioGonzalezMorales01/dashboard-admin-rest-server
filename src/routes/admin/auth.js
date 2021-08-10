const express = require("express");
const { requireSingIn } = require("../../common-middleware");
const { signup, signin, signout } = require("../../controllers/admin/auth");
const {
	validateSignInRequest,
	isRequestValidated,
	validateSignUpRequest,
} = require("../../validators/auth");
const router = express.Router();

router.post("/admin/signin", validateSignInRequest, isRequestValidated, signin);

router.post("/admin/signup", validateSignUpRequest, isRequestValidated, signup);

router.post("/admin/signout", signout);
module.exports = router;
