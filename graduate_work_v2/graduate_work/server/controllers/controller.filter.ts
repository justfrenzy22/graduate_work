import { Response } from "express";
import { RequestI } from "../middleware/authNext";
import fetch from "node-fetch";
import env from "../config/env";
import Env from "../config/env.interface";
import { processDiscover, processKeywordDiscover, searchProcess, sortFn } from "../utils/filter";
import handle from "../view/filter";

const quickSearch = async (req: RequestI, res: Response) => {
	const { keyword, lang } = req.query as unknown as {
		keyword: string;
		lang: "bg-BG" | "en-US";
	};

	const { searchURL, accessToken } = env as Env;

	try {
		const response = await fetch(
			`${searchURL}/multi?query=${keyword}&include_adult=false&language=${lang}&page=${1}`,
			{
				method: "GET",
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)
			.then((res) => res.json())
			.catch((err) => console.error(err));

		if (!response) return handle.internalError(res, lang);
		else if (response.results.length === 0) return handle.notFound(res, lang);


		// const results = response.results.filter(
		// 	(result: { media_type: string }) =>
		// 		result.media_type === "movie" || result.media_type === "tv"
		// );

		let arr = [];

		for (let i =0; i < response.results.length && i < 5; i++) {
			if (response.results[i].media_type === "movie" || response.results[i].media_type === "tv") {
				arr.push(response.results[i]);
			}
		}

		const filtered = await searchProcess(req, arr, lang);

		return handle.success(res, filtered);
	} catch (err) {
		console.error(err);
		handle.internalError(res, lang);
	}
};

const discover = async (req: RequestI, res: Response) => {
	const {
		keyword,
		type,
		genres,
		beforeYear,
		afterYear,
		country,
		sort,
		page,
		lang,
	} = req.query as unknown as {
		keyword: string;
		type: "movie" | "tv" | "multi";
		genres: string;
		beforeYear: string;
		afterYear: string;
		country: string;
		sort: `popularity` | `vote_average` | `title` | `release_date`;
		page: string;
		lang: "bg-BG" | "en-US";
	};

	if (keyword) {
		const {media, nextPage} = await processKeywordDiscover(
			keyword,
			type,
			genres,
			beforeYear,
			afterYear,
			country,
			sort,
			lang,
			page,
		);

		if (media.length === 0) return handle.notFound(res, lang);

		return handle.successKeywordFilter(res, media, nextPage);
	} else {

		const { media, nextPage } = await processDiscover(
			type,
			page,
			lang,
			beforeYear,
			afterYear,
			sort,
			genres,
			country,
		)

		if (media.length === 0) return handle.notFound(res, lang);

		return handle.successKeywordFilter(res, media, nextPage);
	}
};

export default {
	quickSearch,
	discover,
};
