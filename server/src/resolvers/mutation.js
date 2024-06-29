export const Mutation = {
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
