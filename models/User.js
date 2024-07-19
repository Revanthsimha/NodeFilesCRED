const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		password: {
			type: String,
		},
	},
	{ timestamps: true }
);

const user = mongoose.model('user',userSchema)
module.exports = user