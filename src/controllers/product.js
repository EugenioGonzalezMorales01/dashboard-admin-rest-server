const Product = require("../models/product");
const shorId = require("shortid");
const slugify = require("slugify");

exports.createProduct = (req, res) => {
	//res.status(200).json({ file: req.files, body: req.body });

	const { name, price, description, quantity, category } = req.body;
	let productPictures = [];
	if (req.files.length > 0) {
		productPictures = req.files.map((file) => {
			return { img: file.filename };
		});
	}

	const product = new Product({
		name: name,
		slug: slugify(name),
		price,
		description,
		quantity,
		productPictures,
		category,
		createdBy: req.user._id,
	});

	product.save((error, product) => {
		if (error) return res.status(400).json({ error });
		if (product) {
			res.status(201).json({ product });
		}
	});
};

exports.updateProduct = async (req, res) => {
	//res.status(200).json({ file: req.files, body: req.body });
	const { name, price, description, quantity, category } = req.body;
	//const productFromDB = await Product.findOne({ name: name }).exec();
	const _id = req.body._id;
	const product = {
		name,
		price,
		description,
		quantity,
		category,
		createdBy: req.user._id,
	};
	const updatedCategory = await Product.findOneAndUpdate({ _id }, product, {
		new: true,
	});
	res.status(201).json({ message: "Producto Actualizado" });
};

exports.deleteProduct = async (req, res) => {
	const updatedCategory = await Product.findOneAndDelete({
		_id: req.body.payload,
	});
	res.status(201).json({ message: "Producto Eliminado" });
};
