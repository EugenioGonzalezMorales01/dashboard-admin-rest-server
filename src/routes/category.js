const express = require("express");
const Category = require("../models/category");
const slughify = require("slugify");
const { default: slugify } = require("slugify");
const category = require("../models/category");
const {
	addCategory,
	getCategories,
	updateCategories,
	deleteCategories,
} = require("../controllers/category");
const { requireSingIn, adminMiddleware } = require("../common-middleware");
const router = express.Router();
//Almacenamiento de imagen
const multer = require("multer");
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
	"/category/create",
	requireSingIn,
	adminMiddleware,
	upload.single("categoryImage"),
	addCategory
);
router.get("/category/getCategories", getCategories);
router.post(
	"/category/update",
	upload.array("categoryImage"),
	updateCategories
);
router.post("/category/deleteCategories", deleteCategories);
module.exports = router;
