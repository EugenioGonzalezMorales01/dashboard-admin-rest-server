const express = require("express");
const Product = require("../models/product");
const {
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/product");
const { requireSingIn, adminMiddleware } = require("../common-middleware");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(path.dirname(__dirname), "uploads"));
	},
	filename: function (req, file, cb) {
		cb(null, shortid.generate() + "-" + file.originalname);
	},
});

const upload = multer({ storage });

router.post(
	"/product/create",
	requireSingIn,
	adminMiddleware,
	upload.array("productPicture"),
	createProduct
);

router.post(
	"/product/updateProduct",
	requireSingIn,
	adminMiddleware,
	upload.array("productPicture"),
	updateProduct
);

router.post(
	"/product/deleteProduct",
	requireSingIn,
	adminMiddleware,
	deleteProduct
);

module.exports = router;
