const express = require("express");
const env = require("dotenv");
const app = express();
const cors = require("cors");
//const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const path = require("path");

//port
const PORT = process.env.PORT || 2000;

//enviroment variable
env.config();

//mongoDB connection
mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.kqbyk.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		}
	)
	.then(() => {
		console.log("Database Connected");
	});

//middleware
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(
	express.urlencoded({
		extended: true,
	})
);

//React-heroku
if (Process.env.NODE_ENV === "production") {
}

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
