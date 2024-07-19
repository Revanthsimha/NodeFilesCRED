const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const dotenv = require("dotenv")
dotenv.config()

const EmployeeRouter = require("./routes/EmployeeRouter");
const AuthRoute = require("./routes/auth")

mongoose.connect("mongodb://127.0.0.1:27017/collageDB"); //this two is user to find common errors
// {useNewUrlParser:true,useUnifiedTopology:true}
const db = mongoose.connection;

db.on("err", (err) => {
	console.log(err);
});

db.once("open", () => {
	console.log("DB Connection Established");
});

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads",express.static("uploads"))

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

app.use("/api/employee", EmployeeRouter);
app.use("/api",AuthRoute);
