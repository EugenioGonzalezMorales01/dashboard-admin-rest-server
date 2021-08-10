const express = require("express");
const Category = require("../models/cart");
const slughify = require("slugify");
const { default: slugify } = require("slugify");
const category = require("../models/category");
const { addItemToCart } = require("../controllers/cart");
const { requireSingIn, userMiddleware } = require("../common-middleware");
const router = express.Router();

router.post(
	"/user/cart/addtocart",
	requireSingIn,
	userMiddleware,
	addItemToCart
);

module.exports = router;
