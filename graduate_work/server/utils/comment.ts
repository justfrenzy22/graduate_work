import { ObjectId } from "mongoose";
import Comment from "../models/comment";
import { CommentI } from "../models/comment.interface";

export const createComment = async (
	id: string,
	username: string,
	content: string,
	media: "movie" | "tv",
	mediaId: number,
	parentId?: string
) => {
	const newComment = new Comment({
		id: id,
		username: username,
		content: content,
		media: media,
		mediaId: mediaId,
		parentId: null,
		createdAt: new Date(),
	});

	await newComment.save();
};

export const createReplyComment = async (
	id: string,
	username: string,
	content: string,
	media: "movie" | "tv",
	mediaId: number,
	parentId: string
) => {
	const newComment = new Comment({
		id: id,
		username: username,
		content: content,
		media: media,
		mediaId: mediaId,
		parentId: parentId,
		createdAt: new Date(),
	});

	await newComment.save();
};

export const initComments = async (
	media: CommentI["media"],
	mediaId: CommentI["mediaId"]
): Promise<CommentI[] | null> => {
	const comments = await Comment.aggregate([
		{ $match: { media: media, mediaId: mediaId, parentId: null } },
		{ $sort: { createdAt: -1 } },
		// { $limit: 10 },
	]).exec();

	for (const comment of comments) {
		const nestedComments = await Comment.find({ parentId: comment._id }).exec();
		comment.hasNestedComments = nestedComments.length > 0;
	}

	return comments || null;
};

export const deleteCommentWithNested = async (id: string) => {
	await Comment.findByIdAndDelete(id);

	await Comment.deleteMany({ parentId: id });
};

export const nestedComments = async (
	media: CommentI["media"],
	mediaId: CommentI["mediaId"],
	parentId: string
): Promise<CommentI[] | null> => {
	// const comments = await Comment.aggregate([
	// 	{ $match: { media: media, mediaId: mediaId, parentId: parentId } },
	// { $sort: { createdAt: -1 } },
	// { $limit: 10 },
	// ]).exec();

	// const comments = await Comment.aggregate([
	// 	{ $match: { media: media, mediaId: mediaId, parentId: parentId } },
	// 	// { $sort: { createdAt: -1 } },
	// 	// { $limit: 10 },
	// ]).exec();

	const comments = await Comment.find({
		media: media,
		mediaId: mediaId,
		parentId: parentId,
	}).exec();

	let results = [];

	// for (const comment of comments) {
	// 	const nestedComments = await Comment.find({ parentId: comment._id }).exec();

	// 	console.log(`nestedComments`, nestedComments.length);
	// 	comment.hasNestedComments = nestedComments.length > 0;
	// }

	for (let i = 0; i < comments.length; i++) {
		const comment = comments[i];

		const nestedComments = await Comment.find({ parentId: comment._id }).exec();

		const commentObj = comment.toObject();

		commentObj.hasNestedComments = nestedComments.length > 0;

		results.push(commentObj);
	}

	return results || null;
};
