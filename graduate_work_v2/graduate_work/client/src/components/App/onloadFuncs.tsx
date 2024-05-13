import Cookies from "js-cookie";
import { AppContextTypes } from "../../utils/AppContext";

const PopularMovies = async (
	lang: AppContextTypes['defaultLanguage'],
	page: number
): Promise<object> => {
	const response = await Fetch(
		`/api/movie/popular?lang=${lang}&page=${page}`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

const TrendingMovies = async (
	lang: AppContextTypes['defaultLanguage'],
	page: number
): Promise<object> => {
	const response = await Fetch(
		`/api/movie/trending?lang=${lang}&time_window=day&page=${page}`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

const NowPlayingMovies = async (
	lang: AppContextTypes['defaultLanguage'],
	page: number
): Promise<object> => {
	const response = await Fetch(
		`/api/movie/nowPlaying?lang=${lang}&page=${page}`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

const PopularTV = async (lang: AppContextTypes['defaultLanguage'], page: number): Promise<object> => {
	const response = await Fetch(
		`/api/tv/popular?lang=${lang}&page=${page}`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

const TrendingTV = async (lang: AppContextTypes['defaultLanguage'], page: number): Promise<object> => {
	const response = await Fetch(
		`/api/tv/trending?lang=${lang}&time_window=day&page=${page}`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

const NowPlayingTV = async (lang: AppContextTypes['defaultLanguage'], page: number): Promise<object> => {
	// const url = new URL(`/api/tv/airingToday`);
	// console.log(`goes here`);
	// if (lang) {
	//     lang === "bg"
	//         ? url.searchParams.append("lang", "bg-BG")
	//         : url.searchParams.append("lang", "en-US");
	//     url.searchParams.append("page", `${page}`);
	// }
	const response = await Fetch(
		`/api/tv/airingToday?lang=${lang}&page=${page}`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

const Load = async (token: string) => {
	const response = await Fetch(`/api/user/load`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": `${token}`,
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));
	return response;
};

const WatchListStatus = async (mediaId: number, mediaType: "Movie" | "TV") => {
	const token = Cookies.get("access-token");
	const response = await Fetch(
		`/api/user/watchListStatus?id=${mediaId}&mediaType=${mediaType}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": `${token}`,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

const addSiteApiKeyHeader = (options : any) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers["site-api-key"] = apiKey;
    }
    return options;
};

const Fetch = async (url : string, options: any) => {
    options = addSiteApiKeyHeader(options);
    return fetch(url, options);
};


export {
	PopularMovies,
	TrendingMovies,
	NowPlayingMovies,
	PopularTV,
	TrendingTV,
	NowPlayingTV,
	Load,
	WatchListStatus,
    Fetch,
};
