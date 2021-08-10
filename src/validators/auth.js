const { check, validationResult } = require("express-validator");

exports.validateSignUpRequest = [
	check("firstName")
		.notEmpty()
		.withMessage("Se requiere que ingrese su nombre"),
	check("lastName").notEmpty().withMessage("El apellido es requerido"),
	check("email").isEmail().withMessage("El email es requerido"),
	check("password")
		.isLength({ min: 6 })
		.withMessage("La contraseña debe tener almenos 6 caracteres"),
];

exports.validateSignInRequest = [
	check("email").isEmail().withMessage("El email es requerido"),
	check("password")
		.isLength({ min: 6 })
		.withMessage("La contraseña debe tener almenos 6 caracteres"),
];

exports.isRequestValidated = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.array().length > 0) {
		return res.status(400).json({ erors: errors.array()[0].msg });
	}
	next();
};
