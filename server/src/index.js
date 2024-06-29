import 'dotenv/config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import jwt from 'jsonwebtoken'

import { typeDefs } from './schema.js'

import { connect } from './db.js'
import { models } from './models/index.js'
import { resolvers } from './resolvers/index.js'

// Получаем информацию пользователя из JWT
const getUser = token => {
	if (token) {
		try {
			// Возвращаем информацию пользователя из токена
			return jwt.verify(token, process.env.JWT_SECRET)
		} catch (err) {
			// Если с токеном возникла проблема, выбрасываем ошибку
			new Error('Session invalid')
		}
	}
}

// Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

const app = express()

// Запускаем Server
const start = async () => {
	// Connect to DB
	connect(DB_HOST)

	// Настройка Apollo Server
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req }) => {
			// Получаем токен пользователя из заголовков
			const token = req.headers.authorization
			// Пытаемся извлечь пользователя с помощью токена
			const user = getUser(token)
			// Пока что будем выводить информацию о пользователе в консоль:
			console.log(user)
			// Добавляем модели БД и пользователя в контекст
			return { models, user }
		},
	})

	// Запуск Apollo Server
	await server.start()

	// Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
	server.applyMiddleware({ app, path: '/api' })

	app.get('/', (req, res) => res.send('Hello World'))

	app.listen({ port }, () =>
		console.log(
			`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
		)
	)
}

start()
