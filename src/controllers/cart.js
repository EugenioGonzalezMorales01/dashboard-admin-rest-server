const Cart = require("../models/cart");
exports.addItemToCart = (req, res) => {
	Cart.findOne({ user: req.user._id }).exec((error, cart) => {
		if (error) return res.status(400).json({ error });
		if (cart) {
			//Si el carrito ya existe solo tenemos que actualizarlo
			const product = req.body.cartItems.product;
			const item = cart.cartItems.find((c) => c.product == product);
			let condition, update;

			if (item) {
				//Actualizar la cantidad del producto que ya esta en el carrito
				condition = { user: req.user._id, "cartItems.product": product };
				update = {
					$set: {
						"cartItems.$": {
							...req.body.cartItems,
							quantity: item.quantity + req.body.cartItems.quantity,
						},
					},
				};
			} else {
				//Agregar un producto al carrito
				condition = {
					user: req.user._id,
				};
				update = {
					$push: {
						cartItems: req.body.cartItems,
					},
				};
			}
			//Generar el cambio en la coleccion "cart" con respecto a las variables anteriores
			Cart.findOneAndUpdate(condition, update).exec((error, _cart) => {
				if (error) return res.status(400).json({ error });
				if (_cart) {
					return res.status(201).json({ cart: _cart });
				}
			});
		} else {
			//Si el carrito no existe tenemos que crearlo
			const cart = new Cart({
				user: req.user._id,
				cartItems: [req.body.cartItems],
			});

			cart.save((error, cart) => {
				if (error) return res.status(400).json({ error });
				if (cart) {
					res.status(200).json({ cart });
				}
			});
		}
	});
};
