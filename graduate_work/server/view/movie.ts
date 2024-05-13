import { Response } from "express";
import { CommentI } from "../models/comment.interface";
import MovieI from "../models/movie.interface";

const createdMovie = (
	res: Response,
	details: MovieI | null,
	recommended: MovieI[] | null
) =>
	res.status(200).json({
		status: 200,
		message: "Movie created successfully",
		details: details,
		comments: null,
		recommended: recommended,
	});

const internalError = (res: Response) =>
	res.status(500).json({ status: 500, message: "Internal server error" });

const movieExists = (
	res: Response,
	details: MovieI,
	comments: CommentI[] | null,
	recommended: MovieI[] | null
) =>
	res.status(200).json({
		status: 200,
		message: "Movie already exists",
		details: details,
		comments: comments,
		recommended: recommended,
	});

const moviesFetched = (res: Response, movies: MovieI[]) =>
	res.status(200).json({
		status: 200,
		message: "Movies fetched successfully",
		movies: movies,
	});

const previewSuccess = (res: Response, movie: MovieI | null) =>
	res.status(200).json({
		status: 200,
		message: "Preview Movie details fetched successfully",
		details: movie,
	});

const moviesDeleted = (res: Response) =>
	res.status(200).json({ status: 200, message: "Movies deleted successfully" });

export default {
	createdMovie,
	internalError,
	movieExists,
	moviesFetched,
	moviesDeleted,
	previewSuccess,
};
