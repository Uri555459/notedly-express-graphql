import { gql } from 'apollo-server-express'
// Построение схемы с использованием языка схем GraphQL
export const typeDefs = gql`
	scalar DateTime

	type Note {
		id: ID!
		content: String!
		author: User!
		createdAt: DateTime!
		updatedAt: DateTime!
	}
	type User {
		id: ID!
		username: String!
		email: String!
		avatar: String
		notes: [Note!]!
	}

	type Query {
		hello: String!
		notes: [Note!]!
		note(id: ID!): Note!
	}

	type Mutation {
		newNote(content: String!): Note!
		updateNote(id: ID!, content: String!): Note!
		deleteNote(id: ID!): Boolean!
		signUp(username: String!, email: String!, password: String!): String!
		signIn(username: String, email: String, password: String!): String!
	}
`
