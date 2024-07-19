const User = require("../models/User"); // Assuming your model is defined as User
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//New Register
const register = (req, res, next) => {
	bcrypt.hash(req.body.password, 10, function (err, hashedpass) {
		if (err) {
			res.json({
				error: err,
			});
		}

		const user = new User({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			password: hashedpass,
		});

		user
			.save()
			.then((result) => {
				res.json({
					message: "User Registered Successfully!",
				});
			})
			.catch((err) => {
				res.json({
					message: "An error occurred!",
				});
			});
	});
};

//login code

const login = (req, res, next) => {
	var username = req.body.username;
	var password = req.body.password;

	User
		.findOne({ $or: [{ email: username }, { phone: username }] })
		.then((user) => {
			if (user) {
				bcrypt.compare(password, user.password, function (err, result) {
					if (err) {
						res.json({
							error: err,
						});
					}
					if (result) {
						let token = jwt.sign({ name: user.name }, "verySecretValue", {
							expiresIn: "1h",
						});
						res.json({
							message: "Login Successful!",
							token,
						});
					} else {
						res.json({
							message: "Password does not matched!",
						});
					}
				});
			} else {
				res.json({
					message: "User not found!",
				});
			}
		});
};

module.exports = {
	register,login
};
