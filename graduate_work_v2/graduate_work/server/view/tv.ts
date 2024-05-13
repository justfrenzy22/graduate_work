import { Response } from "express";
import { CommentI } from "../models/comment.interface";
import TVI from "../models/tv.interface";

const createdTV = (
	res: Response,
	details: TVI | null,
	recommended: TVI[] | null
) =>
	res.status(201).json({
		status: 200,
		message: "TV show created successfully",
		details: details,
		comments: null,
		recommended: recommended,
	});

const internalError = (res: Response) =>
	res.status(500).json({ status: 500, message: "Internal server error" });

const tvExists = (
	res: Response,
	details: TVI,
	comments: CommentI[] | null,
	recommended: TVI[] | null
) =>
	res.status(200).json({
		status: 200,
		message: "TV show already exists",
		details: details,
		comments: comments,
		recommended: recommended,
	});

const tvShowsFetched = (res: Response, tvShows: TVI[]) =>
	res.status(200).json({
		status: 200,
		message: "TV shows fetched successfully",
		tvShows: tvShows,
	});

const previewSuccess = (res: Response, details: TVI | null) =>
	res.status(200).json({
		status: 200,
		message: `TV show details fetched successfully`,
		details: details,
	});

const tvShowsDeleted = (res: Response) =>
	res
		.status(200)
		.json({ status: 200, message: "TV shows deleted successfully" });

export default {
	createdTV,
	internalError,
	tvExists,
	tvShowsFetched,
	previewSuccess,
	tvShowsDeleted,
};
