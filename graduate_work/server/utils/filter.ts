import fetch from "node-fetch";
import { RequestI } from "../middleware/authNext";
import MovieI from "../models/movie.interface";
import TVI from "../models/tv.interface";
import User from "../models/users";
import UserI from "../models/users.interface";
import { processMovies } from "./movie";
import { processTVs } from "./tv";
import env from "../config/env";
import Env from "../config/env.interface";
import { parseISO } from "date-fns";

export interface MediaI extends MovieI, TVI {
	[x: string]: any;
	media_type: `movie` | `tv`;
	check: boolean;
}

export const searchProcess = async (
	req: RequestI,
	results: MediaI[],
	lang: "bg-BG" | "en-US"
	// isAuth: boolean,
	// user: UserI | null
): Promise<MediaI[]> => {
	const movies = results.filter((m) => m.media_type === "movie") as MovieI[];
	const tvs = results.filter((m) => m.media_type === "tv") as TVI[];

	if (req.isAuth) {
		const user = (await User.findOne({ _id: req.user?._id })) as UserI | null;
		const liked = user?.liked as UserI["liked"];

		results.forEach(
			(result) =>
				(result.check = liked.some(
					(item) => item.id === result.id && item.media === result.media_type
				)
					? true
					: false)
		);
	} else {
		results.forEach((result) => (result.check = false));
	}

	await Promise.all([processMovies(movies, lang), processTVs(tvs, lang)]);

	return results as MediaI[];
};

export const processDiscover = async (
	type: `movie` | `tv` | `multi`,
	page: string,
	lang: `bg-BG` | `en-US`,
	beforeYear: string,
	afterYear: string,
	sort: `popularity` | `vote_average` | `title` | `release_date`,
	genres: string,
	country: string
) => {
	const { discoverURL, accessToken } = env as Env;

	if (type === `multi`) {
		const filSortMovie = sort === `release_date` ? `primary_release_date` : sort;
		const filSortTv = sort === `release_date` ? `first_air_date` : sort;
		const dateMovie = `primary_release_date`;
		const dateTv = `first_air_date`;

		const responseMovies = await fetch(`${discoverURL}/movie?include_adult=false&language=${lang}&page=${page}${afterYear ? `&${dateMovie}.gte=${afterYear}` : ''}${beforeYear ? `&${dateMovie}.lte=${beforeYear}` : ''}${genres ? `&with_genres=${genres}` : ''}${country ? `&with_origin_country=${country}` : ''}${sort ? `&sort_by=${filSortMovie}.asc` : ''}`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const responseTvs = await fetch(`${discoverURL}/tv?include_adult=false&language=${lang}&page=${page}${afterYear ? `&${dateTv}.gte=${afterYear}` : ''}${beforeYear ? `&${dateTv}.lte=${beforeYear}` : ''}${genres ? `&with_genres=${genres}` : ''}${country ? `&with_origin_country=${country}` : ''}${sort ? `&sort_by=${filSortTv}.asc` : ''}`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!responseMovies.ok || !responseTvs.ok) {
			throw new Error(`Failed to fetch data. Status: ${responseMovies.status} ${responseTvs.status}`);
		}
		const dataMovies = await responseMovies.json();
		const dataTvs = await responseTvs.json();

		if (!dataMovies.results || !dataTvs.results || dataMovies.results.length === 0 || dataTvs.results.length === 0) {
			return { media: [], nextPage: 0 };
		}
		else if (dataMovies.results.length === 0 && !dataMovies.results) {
			await processTVs(dataTvs.results, lang);
			return { media: dataTvs.results, nextPage: 0 };
		}
		else if (dataTvs.results.length === 0 && !dataTvs.results) {
			await processMovies(dataMovies.results, lang);
			return { media: dataMovies.results, nextPage: 0 };
		}
		else {
			// return {sortFn([...dataMovies.results, ...dataTvs.results], sort);
			await Promise.all([processMovies(dataMovies.results, lang), processTVs(dataTvs.results, lang)]);
			const media = sortFn([...dataMovies.results, ...dataTvs.results], sort);
			return { media: media, nextPage: parseInt(page) + 1 };
		}
	}
	else  {
		const filSort = sort === `release_date` ? type === `movie` ? `primary_release_date` : `first_air_date` : sort;
		const dates = type === `movie` ? `primary_release_date` : `first_air_date`;


		const response = await fetch(`${discoverURL}/${type}?include_adult=false&language=${lang}&page=${page}${afterYear ? `&${dates}.gte=${afterYear}` : ''}${beforeYear ? `&${dates}.lte=${beforeYear}` : ''}${genres ? `&with_genres=${genres}` : ''}${country ? `&with_origin_country=${country}` : ''}${sort ? `&sort_by=${filSort}.asc` : ''}`, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		}).then((res) => res.json())
		.catch((err) => console.error(err));

		if (!response.results || response.results.length === 0) {
			return { media: [], nextPage: 0 };
		}

		if (type === `movie`) {
			await processMovies(response.results, lang);
		} else if (type === `tv`) {
			await processTVs(response.results, lang);
		}

		return {media: response.results, nextPage: parseInt(page) + 1};
	}



};

export const processKeywordDiscover = async (
	keyword: string,
	type: "movie" | "tv" | "multi",
	genres: string,
	beforeYear: string,
	afterYear: string,
	country: string,
	sort: "popularity" | "vote_average" | "title" | "release_date",
	lang: "bg-BG" | "en-US",
	pag: string,
): Promise<{ media: MediaI[]; nextPage: number }> => {
	const { searchURL, accessToken } = env as Env;
	let allResults: Set<MediaI> = new Set();
	let page = parseInt(pag);
	let requestsMade = 0;
	let totalPages = 0;
	let genresArr = genres
		? genres
				.split(",")
				.map((genre) => genre.trim())
				.map(Number)
		: [];
	let countryArr = country ? country.split(",") : [];

	try {
		while (requestsMade < 10 && allResults.size <= 20) {
			const response = await fetch(
				`${searchURL}/${type}?query=${keyword}&include_adult=false&language=${lang}&page=${page}`,
				{
					method: "GET",
					headers: {
						accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch data. Status: ${response.status}`);
			}

			const data = await response.json();

			if (!data.results || data.results.length === 0) {
				break;
			}

			data.results.forEach((result: MediaI) => {
				if (type !== `multi`) {
					result.media_type = type;
				}
				let dateField: "release_date" | "first_air_date" = "release_date";

				if (result.media_type === "tv") {
					dateField = "first_air_date";
				}
				console.log(`result`, result);
				const date = result[dateField];
				const befDate = beforeYear;
				const aftDate = afterYear;

				const isAft = aftDate ? befDateCalc(date, aftDate) : false;
				const isBef = befDate ? befDateCalc(befDate, date) : false;

				if (
					(!aftDate || isAft) &&
					(!befDate || isBef) &&
					(!country ||
						!result.origin_country ||
						(typeof result.origin_country === "object" &&
							result.origin_country.some((c: any) =>
								countryArr.includes(c)
							))) &&
					(genresArr.length === 0 ||
						(typeof result.genre_ids === "object" &&
							result.genre_ids.some((g: any) => genresArr.includes(g))))
				) {
					allResults.add(result);
				}
			});

			if (page >= data.total_pages) {
				break;
			}

			if (allResults.size < 20) {
				page++;
			}
			requestsMade++;
			totalPages = data.total_pages;
		}

		const results = Array.from(allResults);

		if (results.length > 0) {
			const movies = results.filter((m) => m.media_type === "movie");
			const tvs = results.filter((tv) => tv.media_type === "tv");

			await Promise.all([processMovies(movies, lang), processTVs(tvs, lang)]);

			sortFn(results, sort);
			const nextPage = page > totalPages ? totalPages : page;

			if (results.length > 20) {
				return { media: results.slice(0, 20), nextPage: nextPage };
			} else {
				return { media: results, nextPage: nextPage };
			}
		} else {
			return { media: results, nextPage: 0 };
		}
	} catch (error) {
		console.error("An error occurred:", error);
		return {
			media: [],
			nextPage: 0,
		};
	}
};

export const sortFn = (
	media: MediaI[],
	sort: "popularity" | "vote_average" | "title" | "release_date"
): MediaI[] => {
	switch (sort) {
		case "popularity":
			media.sort((a, b) => b.vote_count - a.vote_count);
			break;
		case "vote_average":
			media.sort((a, b) => b.vote_average - a.vote_average);
			break;
		case "title":
			media.sort((a, b) => a.title.localeCompare(b.title));
			break;
		case "release_date":
			media.sort(
				(a, b) =>
					(a.media_type === "movie"
						? new Date(a.release_date).getTime()
						: new Date(a.first_air_date).getTime()) -
					(b.media_type === "movie"
						? new Date(b.release_date).getTime()
						: new Date(b.first_air_date).getTime())
			);
			break;
		default:
			break;
	}

	return media;
};

const befDateCalc = (date: string, befDate: string) => {
	const [year1, month1, day1] = date.split("-").map(Number);
	const [year2, month2, day2] = befDate.split("-").map(Number);
	if (year1 < year2) {
		return true;
	} else if (year1 === year2) {
		if (month1 < month2) {
			return true;
		} else if (month1 === month2) {
			if (day1 <= day2) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
};
