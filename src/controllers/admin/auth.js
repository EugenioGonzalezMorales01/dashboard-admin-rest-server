const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const bcrypt = require("bcrypt-nodejs");
exports.signup = (req, res) => {
	User.findOne({ email: req.body.email }).exec(async (error, user) => {
		//Email ya registrado
		if (user)
			return res.status(400).json({
				message: "Admin already registered",
			});
		//Tomamos los parametros que envia el usuario
		console.log(req.body);
		const { firstName, lastName, email, password } = req.body;
		//Encarptacion de la contraseña por metodo asincrono
		console.log("Si es el bcrypt");
		const hash_password = await bcrypt.hashSync(password, 10);
		console.log("No es el bcrypt");
		//Los entroducimos dentro de una variable
		const _user = new User({
			firstName,
			lastName,
			email,
			hash_password,
			userName: Math.random().toString(),
			role: "admin",
		});
		console.log(_user);
		//Guardamos el usuario en la base de datos
		_user.save((error, data) => {
			if (error) {
				return res.status(400).json({
					message: `Something went wrong ${error}`,
				});
			}
			if (data) {
				return res.status(201).json({
					message: "Admin created succcessfully",
				});
			}
		});
	});
};

exports.signin = (req, res) => {
	User.findOne({ email: req.body.email }).exec((error, user) => {
		if (error) return res.status(400).json({ error });
		if (user) {
			if (user.authenticate(req.body.password) && user.role === "admin") {
				const token = jwt.sign(
					{ _id: user._id, role: user.role },
					process.env.JWT_SECRET,
					{
						expiresIn: "1d",
					}
				);
				const { _id, firstName, lastName, email, role, fullName } = user;
				res.cookie("token", token, { expiresIn: "1h" });
				res.status(200).json({
					token,
					user: {
						_id,
						firstName,
						lastName,
						email,
						role,
						fullName,
					},
				});
			} else {
				return res.status(400).json({
					message: "Invalid password",
				});
			}
		} else {
			return res.status(400).json({ message: "Something went wrong" });
		}
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.status(200).json({
		message: "Sign Out Successfully",
	});
};
