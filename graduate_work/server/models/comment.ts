import { Schema, Model, model } from "mongoose";
import { CommentI } from "./comment.interface";
import e from "express";

const commentSchema = new Schema({
	id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	media: {
		type: String,
		enum: ["movie", "tv"],
		required: true,
	},
	mediaId: {
		type: Number,
		required: true,
	},
	parentId: {
		type: Schema.Types.ObjectId,
		ref: "Comment",
		default: null,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
});

const Comment: Model<CommentI> = model<CommentI>(`Comment`, commentSchema);

export default Comment;
