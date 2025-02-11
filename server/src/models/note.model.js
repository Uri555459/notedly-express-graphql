import mongoose from 'mongoose'

// Определяем схему БД заметки
const noteSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		// Присваиваем поля createdAt и updatedAt с типом данных
		timestamps: true,
	}
)

// Определяем модель 'Note' со схемой
export const Note = mongoose.model('Note', noteSchema)
