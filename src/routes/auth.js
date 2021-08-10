const express = require("express");
const { signup, signin } = require("../controllers/auth");
const { check } = require("express-validator");
const {
	validateRequest,
	isRequestValidated,
	validateSignUpRequest,
	validateSignInRequest,
} = require("../validators/auth");
const router = express.Router();

router.post("/signin", validateSignInRequest, isRequestValidated, signin);

router.post("/signup", validateSignUpRequest, isRequestValidated, signup);

module.exports = router;
