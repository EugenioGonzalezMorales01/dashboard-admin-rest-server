const jwt = require("jsonwebtoken");
exports.requireSingIn = (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split(" ")[1];

		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
	} else {
		return res.status(400).json({ message: "Autorizacion requerida" });
	}
	next();
};

exports.userMiddleware = (req, res, next) => {
	if (req.user.role !== "user") {
		return res.status(400).json({ message: "Acceso de usuario denegado" });
	}
	next();
};

exports.adminMiddleware = (req, res, next) => {
	if (req.user.role !== "admin") {
		return res
			.status(400)
			.json({ message: "Acceso de administrador denegado" });
	}
	next();
};
