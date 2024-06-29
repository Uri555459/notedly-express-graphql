import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: { unique: true },
		},
		email: {
			type: String,
			required: true,
			index: { unique: true },
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
	},
	{
		// Присваиваем поля createdAt и updatedAt с типом Date
		timestamps: true,
	}
)
export const User = mongoose.model('User', UserSchema)
