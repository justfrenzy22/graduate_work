import Movie from "../models/movie";
import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import env from "../config/env";
import Env from "../config/env.interface";
import handle from "../view/movie";
import {
	findMovie,
	processMovies,
	recMovies,
	saveMovieTwoLanguages,
} from "../utils/movie";
import MovieI from "../models/movie.interface";
import { initComments } from "../utils/comment";
import { CommentI } from "../models/comment.interface";
import { RequestI } from "../middleware/authNext";
import { RequestUserI, addScore, addWatched, statusLiked } from "../utils/user";
import { loadRated } from "../utils/rated";
import { RatedI } from "../models/rated.interface";

interface QueryParams {
	lang: "bg-BG" | "en-US";
	time_window: string;
	page: number;
}

const details = async (req: RequestI, res: Response) => {
	const { id } = req.params;
	const { lang } = req.query as unknown as QueryParams;


	const ID = parseInt(id);

	if (isNaN(ID)) return handle.internalError(res);

	const find: MovieI | null = await findMovie(id, lang);
	const { bg, en } = env as Env;
	const isLangBg = lang === bg ? true : false;

	const recommendMovies = (await recMovies(ID, lang)) as MovieI[] | null;

	if (find) {
		let comments = [] as CommentI[] | null;
		if (req.isAuth) {
			comments = (await initComments(`movie`, ID)) as CommentI[] | null;

			const liked = await statusLiked(req.user as RequestUserI, ID, "movie" as `movie` | `tv`);
			find.check = liked;
			await addScore(req.user?._id as RequestUserI['_id'], ID, `movie`);
			(await addWatched(req.user as RequestUserI, ID, `movie`));
			const rated = await loadRated(req.user as RequestUserI, ID, "movie" as `movie` | `tv`);
			if (rated) {
				find.rating = rated.rating;
			}
		} else {
			find.check = false;
		}
		return handle.movieExists(res, find, comments, recommendMovies);
	} else {
		try {
			const langMovie = await saveMovieTwoLanguages(
				ID,
				lang,
				isLangBg ? bg : en
			);
			if (req.isAuth) {
				await addScore(req.user?._id as RequestUserI['_id'], ID, `movie`);
				(await addWatched(req.user as RequestUserI, ID, `movie`));
				const liked = await statusLiked(req.user as RequestUserI, ID, "movie" as `movie` | `tv`);
				langMovie.check = liked;
				const rated = await loadRated(req.user as RequestUserI, ID, "movie" as `movie` | `tv`);
				if (rated) {
					langMovie.rating = rated.rating;
				}

			}
			return handle.createdMovie(res, langMovie, recommendMovies);
		} catch (err) {
			console.error(err);
			return handle.internalError(res);
		}
	}
};

const preview = async (req: RequestI, res: Response) => {
	const { id } = req.params;
	const { lang } = req.query as unknown as QueryParams;

	const ID = parseInt(id);

	if (isNaN(ID)) return handle.internalError(res);

	const movie: MovieI | null = await findMovie(id, lang);
	const { bg, en } = env as Env;
	const isLangBg = lang === bg ? true : false;

	if (movie) {
		if (req.isAuth) {
			const liked = await statusLiked(req.user as RequestUserI, ID, "movie" as `movie` | `tv`);
			movie.check = liked;
		} else {
			movie.check = false;
		}
		return handle.previewSuccess(res, movie);
	} else {
		try {
			let langMovie = {} as MovieI;
			langMovie = await saveMovieTwoLanguages(ID, lang, isLangBg ? bg : en);

			if (req.isAuth) {
				const liked = await statusLiked(req.user as RequestUserI, ID, `movie`);
				langMovie.check = liked;
			} else {
				langMovie.check = false;
			}
			return handle.previewSuccess(res, langMovie);
		} catch (err) {
			console.error(err);
			return handle.internalError(res);
		}
	}
};

const movieTrailer = async (req: Request, res: Response) => {
	const { id } = req.params;

	const { movieURL, accessToken } = env;
	try {
		const trailers = await fetch(`${movieURL}/${id}/videos?language=en-US`, {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((res) => res.json())
			.catch((err) => console.error(err));

		return res.status(200).json({
			message: "Trailers fetched successfully",
			trailer: trailers.results,
		});
	} catch (err) {
		return handle.internalError(res);
	}
};

const PopularTrendingFetchMovies = async (
	url: string,
	path: string,
	lang: string,
	page: number,
	res: Response
) => {
	const { accessToken }: Env = env;
	const apiUrl = `${url}/${path}?language=${lang}&page=${page}` as string;
	try {
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((res) => res.json())
			.catch((err) => console.error(err));
		return response;
	} catch (err) {
		console.error(err);
		return handle.internalError(res);
	}
};

const popular = async (req: Request, res: Response) => {
	const { movieURL }: Env = env;
	const { lang, page } = req.query as unknown as QueryParams;

	const response = await PopularTrendingFetchMovies(
		movieURL,
		"popular",
		lang,
		page,
		res
	);

	if (!response) return handle.internalError(res);

	await processMovies(response.results, lang);

	return handle.moviesFetched(res, response);
};

const trending = async (req: Request, res: Response) => {
	const { basicURL }: Env = env;
	const { lang, time_window, page } = req.query as unknown as QueryParams;

	const response = await PopularTrendingFetchMovies(
		basicURL,
		`trending/movie/${time_window}`,
		lang,
		page,
		res
	);

	if (!response) return handle.internalError(res);
	await processMovies(response.results, lang);
	handle.moviesFetched(res, response);
};

const nowPlaying = async (req: Request, res: Response) => {
	const { movieURL }: Env = env;
	const { lang, page } = req.query as unknown as QueryParams;

	const response = await PopularTrendingFetchMovies(
		movieURL,
		"now_playing",
		lang,
		page,
		res
	);

	if (!response) return handle.internalError(res);

	await processMovies(response.results, lang);
	handle.moviesFetched(res, response);
};

const findAll = async (req: Request, res: Response) => {
	const findAll = await Movie.find({});
	return handle.moviesFetched(res, findAll);
};

const deleteAll = async (req: Request, res: Response) => {
	await Movie.deleteMany({});
	return handle.moviesDeleted(res);
};

export default {
	details,
	preview,
	movieTrailer,
	popular,
	trending,
	nowPlaying,
	findAll,
	deleteAll,
};
