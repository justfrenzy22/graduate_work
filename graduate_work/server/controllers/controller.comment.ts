import { Response } from "express";
import { RequestI } from "../middleware/authNext";
import {
	createComment,
	createReplyComment,
	deleteCommentWithNested,
	nestedComments,
} from "../utils/comment";
import { CommentI } from "../models/comment.interface";
import { ObjectId } from "mongoose";
import Comment from "../models/comment";

const addComment = async (req: RequestI, res: Response) => {
	const { id, username, content, media, mediaId, parentId, lang } =
		req.query as {
			id: string;
			username: string;
			content: string;
			media: `movie` | `tv`;
			mediaId: string;
			parentId: string;
			lang: "bg-BG" | "en-US";
		};

	const mediaID = parseInt(mediaId);

	await createComment(id, username, content, media, mediaID);

	return res.status(200).json({
		status: 200,
		message:
			lang === "en-US"
				? "Comment added successfully"
				: "Коментарът е добавен успешно",
	});
};

const deleteComment = async (req: RequestI, res: Response) => {
	const { id, lang } = req.query as { id: string; lang: "bg-BG" | "en-US" };

	const comment = await Comment.findById(id);

	if (!comment) {
		return res.status(404).json({
			status: 404,
			message: "Comment not found",
		});
	}

	if (comment._id === req.user?._id || req.user?.role !== "user") {
		await deleteCommentWithNested(id);
		return res.status(200).json({
			status: 200,
			message:
				lang === "en-US"
					? "Comment deleted successfully"
					: "Коментарът е изтрит успешно",
		});
	} else {
        return res.status(401).json({
            status: 401,
            message: lang === 'bg-BG' ? 'Нямате права за изтриване на този коментар' : 'Unauthorized to delete this comment'
        })
    }
};

const replyComment = async (req: RequestI, res: Response) => {
	console.log(`raz dva tri`, req.query);
	const { id, username, content, media, mediaId, parentId, lang } =
		req.query as {
			id: string;
			username: string;
			content: string;
			media: `movie` | `tv`;
			mediaId: string;
			parentId: string;
			lang: "bg-BG" | "en-US";
		};

	await createReplyComment(
		id,
		username,
		content,
		media,
		parseInt(mediaId),
		parentId
	);

	return res.status(200).json({
		status: 200,
		message:
			lang === "en-US"
				? "Comment added successfully"
				: "Коментарът е добавен успешно",
	});
};

const viewMore = async (req: RequestI, res: Response) => {
	const { media, mediaId, parentId, lang } = req.query as {
		media: `movie` | `tv`;
		mediaId: string;
		parentId: string;
		lang: "bg-BG" | "en-US";
	};

	const nested = await nestedComments(media, parseInt(mediaId), parentId);

	return res.status(200).json({
		status: 200,
		message: lang === "en-US" ? "Comments loaded" : "Коментарите са заредени",
		comments: nested,
	});
};
export default {
	addComment,
	replyComment,
	viewMore,
	deleteComment,
};
