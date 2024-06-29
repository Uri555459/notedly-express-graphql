import 'dotenv/config'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

import { connect } from './db.js'
import { models } from './models/index.js'

// Запускаем сервер на порте, указанном в файле .env, или на порте 4000
const port = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

const app = express()

// Построение схемы с использованием языка схем GraphQL
const typeDefs = gql`
	type Note {
		id: ID!
		content: String!
		author: String!
	}

	type Query {
		hello: String!
		notes: [Note!]!
		note(id: ID!): Note!
	}

	type Mutation {
		newNote(content: String!): Note!
	}
`

// Предоставляем функцию разрешения для полей схемы
const resolvers = {
	Query: {
		hello: () => 'Hello world!',
		notes: async () => {
			return await models.Note.find()
		},
		note: async (parent, args) => {
			return await models.Note.findById(args.id)
		},
	},

	Mutation: {
		newNote: async (parent, args) => {
			return await models.Note.create({
				content: args.content,
				author: 'Adam Scott',
			})
		},
	},
}

// Запускаем Server
const start = async () => {
	// Connect to DB
	connect(DB_HOST)

	// Настройка Apollo Server
	const server = new ApolloServer({ typeDefs, resolvers })

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
