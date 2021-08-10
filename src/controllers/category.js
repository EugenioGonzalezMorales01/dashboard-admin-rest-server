const Category = require("../models/category");
const { default: slugify } = require("slugify");
const shortid = require("shortid");

function createCategories(categories, parentId = null) {
	const categoryList = [];
	let category;
	if (parentId == null) {
		category = categories.filter((cat) => cat.parentId == undefined);
	} else {
		category = categories.filter((cat) => cat.parentId == parentId);
	}

	for (let cate of category) {
		categoryList.push({
			_id: cate._id,
			name: cate.name,
			slug: cate.slug,
			parentId: cate.parentId,
			children: createCategories(categories, cate._id),
		});
	}
	return categoryList;
}

exports.addCategory = (req, res) => {
	console.log(req.body);
	const categoryObj = {
		name: String(req.body.name),
		slug: `${slugify(String(req.body.name))}-${shortid.generate()}`,
	};
	if (req.file) {
		categoryObj.categoryImage = "/public/" + req.file.filename;
	}
	if (req.body.parentId) {
		categoryObj.parentId = String(req.body.parentId);
	}
	const cat = new Category(categoryObj);
	cat.save((error, category) => {
		if (error) return res.status(400).json({ error });
		if (category) {
			return res.status(201).json({ category });
		}
	});
};

exports.getCategories = (req, res) => {
	Category.find().exec((error, categories) => {
		if (error) return res.status(400).json({ error });
		if (categories) {
			const categoryList = createCategories(categories);
			res.status(200).json({ categoryList });
		}
	});
};

exports.updateCategories = async (req, res) => {
	console.log(req.body);
	const { _id, name, parentId, type } = req.body;
	const updatedCategories = [];
	//En el caso de multiples categorias a actualizar
	if (name instanceof Array) {
		for (let i = 0; i < name.length; i++) {
			const category = {
				name: name[i],
				type: type[i],
			};
			if (parentId[i] !== "") {
				category.parentId = parentId[i];
			}
			const updatedCategory = await Category.findOneAndUpdate(
				{ _id: _id[i] },
				category,
				{ new: true }
			);
			updatedCategories.push({ updateCategory: updatedCategories });
		}
		return res.status(201).json({ updatedCategories });
		//En el caso de una sola categoria a actualizar
	} else {
		const category = {
			name,
			type,
		};
		if (parentId !== "") {
			category.parentId = parentId;
		}
		const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
			new: true,
		});
		return res.status(201).json({ updatedCategory });
	}
};

exports.deleteCategories = async (req, res) => {
	const { ids } = req.body.payload;
	const deletedCategories = [];
	for (let i = 0; i < ids.length; i++) {
		console.log(ids[i]._id);
		const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
		deletedCategories.push(deleteCategory);
	}
	if (deletedCategories.length === ids.length) {
		res.status(201).json({ message: "Categoria(s) Eliminada(s)" });
	} else {
		res.status(400).json({ message: "Algo salio mal :s" });
	}
};
