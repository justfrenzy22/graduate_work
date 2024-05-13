import TV from "../models/tv";
import { Request, Response } from "express";
import fetch from "node-fetch";
import env from "../config/env";
import Env from "../config/env.interface";
import handle from "../view/tv";
import { findTV, processTVs, recTVs, saveTVTwoLanguages } from "../utils/tv";
import TVI from "../models/tv.interface";
import { initComments } from "../utils/comment";
import { CommentI } from "../models/comment.interface";
import { RequestI } from "../middleware/authNext";
import { RequestUserI, addScore, addWatched, statusLiked } from "../utils/user";
import { loadRated } from "../utils/rated";

interface QueryParams {
	lang: `bg-BG` | `en-US`;
	time_window: string;
	page: number;
	season: string;
	episode: string;
}

const details = async (req: RequestI, res: Response) => {
	const { id } = req.params;
	const { lang, season, episode } = req.query as unknown as QueryParams;

	const ID = parseInt(id);
	const Season = parseInt(season as string);
	const Episode = parseInt(episode as string);

	if (isNaN(ID)) return handle.internalError(res);

	const find: TVI | null = await findTV(id, lang);
	const { bg, en } = env as Env;
	const isLangBg = lang === "bg-BG" ? true : false;

	const recommendTVs = (await recTVs(ID, lang)) as TVI[] | null;

	if (find) {
		let comments = [] as CommentI[] | null;
		if (req.isAuth)
			{
				await addScore(req.user?._id as RequestUserI['_id'], ID, `tv` as `movie` | `tv`);
				comments = (await initComments(`tv`, ID)) as CommentI[] | null;
				(await addWatched(req.user as RequestUserI, ID, `tv`, Season, Episode));
				const liked = await statusLiked(req.user as RequestUserI, ID, "tv");
				find.check = liked;
				const rated = await loadRated(req.user as RequestUserI, ID, "tv" as `movie` | `tv`);
					if (rated) {
						find.rating = rated.rating;
					}
			} else {
				find.check = false;
			}
		return handle.tvExists(res, find, comments, recommendTVs);
	} else {
		try {
			const langTV = await saveTVTwoLanguages(ID, lang, isLangBg ? bg : en);
			if (req.isAuth) {
				await addScore(req.user?._id as RequestUserI['_id'], ID, `tv` as `movie` | `tv`);
				(await addWatched(req.user as RequestUserI, ID, `tv`, Season, Episode));
				const liked = await statusLiked(req.user as RequestUserI, ID, "tv");
				langTV.check = liked;
				const rated = await loadRated(req.user as RequestUserI, ID, "tv" as `movie` | `tv`);

				
					if (rated) {
						langTV.rating = rated.rating;
					}
			} else {
				langTV.check = false;
			}
			return handle.createdTV(res, langTV, recommendTVs);
		} catch (err) {
			return handle.internalError(res);
		}
	}
};

const preview = async (req: RequestI, res: Response) => {
	const { id } = req.params;
	const { lang } = req.query as unknown as QueryParams;

	const ID = parseInt(id);

	if (isNaN(ID)) return handle.internalError(res);

	const tv: TVI | null = await findTV(id, lang);
	const { bg, en } = env as Env;
	const isLangBg = lang === "bg-BG" ? true : false;

	if (tv) {
		if (req.isAuth) {
			const liked = await statusLiked(req.user as RequestUserI, ID, "tv" as `movie` | `tv`);
			
			tv.check = liked;
		} else {
			tv.check = false;
		}
		return handle.previewSuccess(res, tv);
	} else {
		try {
			let langTV = {} as TVI;
			langTV = await saveTVTwoLanguages(ID, lang, isLangBg ? bg : en);
			if (req.isAuth) {
				const liked = await statusLiked(req.user as RequestUserI, ID, `movie`);
				langTV.check = liked;
			} else {
				langTV.check = false;
			}
			return handle.previewSuccess(res, langTV);
		} catch (err) {
			return handle.internalError(res);
		}
	}
};

const tvTrailer = async (req: Request, res: Response) => {
	const { id } = req.params;

	const { tvURL, accessToken } = env;

	try {
		const trailers = await fetch(`${tvURL}/${id}/videos?language=en-US`, {
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

const PopularTrendingFetchTV = async (
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
	const { bg, en, tvURL }: Env = env as Env;
	const { lang, page } = req.query as unknown as QueryParams;

	const response = await PopularTrendingFetchTV(
		tvURL,
		"popular",
		lang,
		page,
		res
	);

	if (!response) return handle.internalError(res);
	await processTVs(response.results, lang);
	return handle.tvShowsFetched(res, response);
};

const trending = async (req: Request, res: Response) => {
	const { basicURL }: Env = env as Env;
	const { lang, time_window, page } = req.query as unknown as QueryParams;

	const response = await PopularTrendingFetchTV(
		basicURL,
		`trending/tv/${time_window}`,
		lang,
		page,
		res
	);

	if (!response) return handle.internalError(res);
	await processTVs(response.results, lang);
	handle.tvShowsFetched(res, response);
};

const airingToday = async (req: Request, res: Response) => {
	const { tvURL }: Env = env as Env;
	const { lang, page } = req.query as unknown as QueryParams;

	try {
		const response = await PopularTrendingFetchTV(
			tvURL,
			"airing_today",
			lang,
			page,
			res
		);

		if (!response) return handle.internalError(res);

		await processTVs(response.results, lang);
		handle.tvShowsFetched(res, response);
	} catch (err) {
		return handle.internalError(res);
	}
};

const findAll = async (req: Request, res: Response) => {
	const findAll = await TV.find({});
	return handle.tvShowsFetched(res, findAll);
};

const deleteAll = async (req: Request, res: Response) => {
	await TV.deleteMany({});
	return handle.tvShowsDeleted(res);
};

export default {
	details,
	tvTrailer,
	popular,
	trending,
	airingToday,
	findAll,
	preview,
	deleteAll,
};
