import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { gravatar } from '../util/gravatar.js'

export const Mutation = {
	signUp: async (parent, { username, email, password }, { models }) => {
		// Нормализуем имейл
		email = email.trim().toLowerCase()
		// Хешируем пароль
		const hashed = await bcrypt.hash(password, 10)
		// Создаем url gravatar-изображения
		const avatar = gravatar(email)

		try {
			const user = await models.User.create({
				username,
				email,
				avatar,
				password: hashed,
			})

			// Создаем и возвращаем json web token
			return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
		} catch (error) {
			console.log(error)
			// Если при регистрации возникла проблема, выбрасываем ошибку
			throw new Error('Error creating account')
		}
	},

	signIn: async (parent, { username, email, password }, { models }) => {
		if (email) {
			// Нормализуем e-mail
			email = email.trim().toLowerCase()
		}

		const user = await models.User.findOne({
			$or: [{ email }, { username }],
		})

		// Если пользователь не найден, выбрасываем ошибку аутентификации
		if (!user) {
			throw new AuthenticationError('Error signing in')
		}

		// Если пароли не совпадают, выбрасываем ошибку аутентификации
		const valid = await bcrypt.compare(password, user.password)
		if (!valid) {
			throw new AuthenticationError('Error signing in')
		}

		// Создаем и возвращаем json web token
		return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
	},

	newNote: async (parent, args, { models }) => {
		return await models.Note.create({
			content: args.content,
			author: 'Adam Scott',
		})
	},

	deleteNote: async (parent, { id }, { models }) => {
		try {
			await models.Note.findByIdAndDelete({ _id: id })

			return true
		} catch (error) {
			return false
		}
	},

	updateNote: async (parent, { id, content }, { models }) => {
		return await models.Note.findByIdAndUpdate(
			{ _id: id },
			{ $set: { content } },
			{ new: true }
		)
	},
}
