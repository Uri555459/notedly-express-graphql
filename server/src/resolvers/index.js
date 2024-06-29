import pkg from 'graphql-iso-date'
const { GraphQLDateTime } = pkg

import { Mutation } from './mutation.js'
import { Query } from './query.js'

export const resolvers = { Query, Mutation, DateTime: GraphQLDateTime }
