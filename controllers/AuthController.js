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

	User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
		(user) => {
			if (user) {
				bcrypt.compare(password, user.password, function (err, result) {
					if (err) {
						res.json({
							error: err,
						});
					}
					if (result) {
						let token = jwt.sign({ name: user.name }, "AzQ,PI)0(", {
							expiresIn: "30s",
						});
						let refreshToken = jwt.sign(
							{ name: user.name },
							"refreshtokensecret",
							{
								expiresIn: "48h",
							}
						);
						res.status(200).json({
							message: "Login Successful!",
							token,
							refreshToken,
						});
					} else {
						res.status(200).json({
							message: "Password does not matched!",
						});
					}
				});
			} else {
				res.json({
					message: "User not found!",
				});
			}
		}
	);
};

const refreshToken = (req, res, next) => {
	const refreshToken = req.body.refreshToken;
	jwt.verify(refreshToken, "refreshtokensecret", function (err, decode) {
		if (err) {
			res.status(400).json({
				err,
			});
		} else {
			let token = jwt.sign({ name: decode.name }, "AzQ,PI)0(", {
				expiresIn: "60s",
			});
			let refreshToken = req.body.refreshToken;
			res.status(200).json({
				message: "Token refreshed successfully!",
				token,
				refreshToken,
			});
		}
	});
};

module.exports = {
	register,
	login,
	refreshToken,
};
