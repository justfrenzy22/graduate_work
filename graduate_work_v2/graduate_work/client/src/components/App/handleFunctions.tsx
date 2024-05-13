import Cookies from "js-cookie";
import { mediaType } from "./props.interface";
import { Fetch } from "./onloadFuncs";
import { useContext } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";

export const GetTheme = (): string => {
	const localTheme = localStorage.getItem("theme");

	if (localTheme !== null) {
		return localTheme;
	} else {
		return "system";
	}
};

export const Login = async (
	data: object,
	lang: `bg-BG` | `en-US`
): Promise<object | undefined> => {
	try {
		const response = await Fetch(`/api/user/login?lang=${lang}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (response.status === 200) {
			const responseData = await response.json();
			const accessTokenHeader = response.headers.get("access-token");
			if (accessTokenHeader) {
				const bearerRemover = accessTokenHeader.split(" ")[1];
				Cookies.set("access-token", bearerRemover, { expires: 3600 });
			}

			return responseData;
		} else {
			const responseData = await response.json();
			return responseData;
		}
	} catch (err) {
		return {
			status: 500,
			message: "Something went wrong. Please try again later.",
		};
	}
};

export const VerifyUser = async (
	token: string,
	lang: AppContextTypes["defaultLanguage"]
): Promise<object> => {
	const response = await Fetch(`/api/user/verify?token=${token}&lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	});
	if (response.status === 200 || response.status === 400) {
		const responseData = await response.json();
		const accessTokenHeader = response.headers.get("access-token");
		if (accessTokenHeader) {
			const bearerRemover = accessTokenHeader.split(" ")[1];
			Cookies.set("access-token", bearerRemover, { expires: 3600 });
		}

		return responseData;
	} else {
		const data = await response.json();
		return data;
	}
};

export const UpdateProfile = async (
	data: object,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(`/api/user/update?lang=${lang}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
		body: JSON.stringify(data),
	});

	if (response.status === 200) {
		const responseData = await response.json();
		const accessTokenHeader = response.headers.get("access-token");
		if (accessTokenHeader) {
			const bearerRemover = accessTokenHeader.split(" ")[1];
			Cookies.set("access-token", bearerRemover, { expires: 3600 });
		}
		return responseData;
	}

	return response;
};

export const Register = async (
	data: object,
	lang: string | undefined
): Promise<object> => {
	const response = await Fetch(`/api/user/register?lang=${lang}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));


	return response;
};

export const Language = (e: string): void => {

	localStorage.setItem("language", e);
};

export const Logout = async () => {
	const { setAccessToken } = useContext<AppContextTypes>(AppContext);
	await Fetch("/api/user/logout", {
		method: "GET",
		headers: { "access-token": Cookies.get("access-token") },
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));
	Cookies.remove("access-token");
	setAccessToken(false);
};

export const ToggleWatchList = async (mediaId: number, mediaType: string) => {
	const accessToken = Cookies.get("access-token");
	const response = await Fetch(
		`/api/user/toggleWatchList?id=${mediaId}&mediaType=${mediaType}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": `${accessToken}`,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));


};

export const QuickSearch = async (
	keyword: string,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(
		`/api/filter/quickSearch?keyword=${keyword}&lang=${lang}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const Discover = async (
	lang: AppContextTypes["defaultLanguage"],
	keyword: string,
	type: string,
	genres: string,
	beforeYear: string,
	afterYear: string,
	sort: string,
	page: string,
	country: string
) => {
	const params = new URLSearchParams();

	if (type) {
		params.append("type", type);
	}

	if (keyword) {
		params.append("keyword", keyword);
	}
	if (genres) {
		params.append("genres", genres);
	}
	if (beforeYear) {
		params.append("beforeYear", beforeYear);
	}
	if (afterYear) {
		params.append("afterYear", afterYear);
	}
	if (sort) {
		params.append("sort", sort);
	}
	if (page) {
		params.append("page", page);
	}
	if (country) {
		params.append("country", country);
	}

	const url = `/api/filter/discover?lang=${lang}&${params.toString()}`;

	const response = await Fetch(`${url}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));
	return response;
};

export const ToggleLikedFunc = async (
	mediaId: number,
	mediaType: `movie` | `tv`,
	defaultLanguage: AppContextTypes["defaultLanguage"]
) => {
	const accessToken = Cookies.get("access-token");
	const response = await Fetch(
		`/api/user/toggleLiked?mediaId=${mediaId}&media_type=${mediaType}&lang=${defaultLanguage}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": `${accessToken}`,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const ToggleIsWatched = async (
	defaultLanguage: AppContextTypes["defaultLanguage"]
) => {
	const accessToken = Cookies.get("access-token");
	const response = await Fetch(
		`/api/user/toggleIsWatched?lang=${defaultLanguage}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": `${accessToken}`,
			},
		}
	);
	if (response.status === 200) {
		const responseData = await response.json();
		const accessTokenHeader = response.headers.get("access-token");
		if (accessTokenHeader) {
			const bearerRemover = accessTokenHeader.split(" ")[1];
			Cookies.set("access-token", bearerRemover, { expires: 3600 });
		}
		return responseData;
	}

	return response;
};

export const AddComment = async (
	_id: string,
	username: string,
	content: string,
	media: "movie" | "tv",
	mediaId: string | undefined,
	parentId: string | null,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(
		`/api/comment/add?id=${_id}&username=${username}&content=${content}&media=${media}&mediaId=${mediaId}&parentId=${parentId}&lang=${lang}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const DeleteComment = async (
	_id: string,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(`/api/comment/delete?id=${_id}&lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const ReplyComment = async (
	_id: string,
	username: string,
	content: string,
	media: "movie" | "tv",
	mediaId: string | undefined,
	parentId: string | null,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(
		`/api/comment/reply?id=${_id}&username=${username}&content=${content}&media=${media}&mediaId=${mediaId}&parentId=${parentId}&lang=${lang}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const ViewMoreComments = async (
	media: "movie" | "tv",
	mediaId: string | undefined,
	parentId: string | null,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(
		`/api/comment/viewMore?media=${media}&mediaId=${mediaId}&parentId=${parentId}&lang=${lang}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const ToggleIsPublic = async (
	defaultLanguage: AppContextTypes["defaultLanguage"]
) => {
	const accessToken = Cookies.get("access-token");
	const response = await Fetch(
		`/api/user/toggleIsPublic?lang=${defaultLanguage}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": `${accessToken}`,
			},
		}
	);

	if (response.status === 200) {
		const responseData = await response.json();
		const accessTokenHeader = response.headers.get("access-token");
		if (accessTokenHeader) {
			const bearerRemover = accessTokenHeader.split(" ")[1];
			Cookies.set("access-token", bearerRemover, { expires: 3600 });
		}
		return responseData;
	}

	return response;
};

export const PopularTV = async (
	lang: AppContextTypes["defaultLanguage"]
): Promise<object> => {
	const response = await Fetch(`/api/tv/popular?lang=${lang}&page=1`, {
		method: "GET",
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const TrendingTV = async (
	lang: AppContextTypes["defaultLanguage"]
): Promise<object> => {
	const response = await Fetch(
		`/api/tv/trending?lang=${lang}&time_window=day&page=1`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const NowPlayingTV = async (
	lang: AppContextTypes["defaultLanguage"]
): Promise<object> => {
	const response = await Fetch(`/api/tv/airingToday?lang=${lang}&page=1`, {
		method: "GET",
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const TVChange = async (
	tvList: mediaType[],
	defaultLanguage: AppContextTypes["defaultLanguage"],
	setTVList: React.Dispatch<React.SetStateAction<mediaType[]>>,
	funcTV: (lang: AppContextTypes["defaultLanguage"]) => Promise<object>,
	isMovies: boolean,
	setIsMovies: (isMovies: boolean) => void,
	setLoading: (loading: boolean) => void
): Promise<void> => {
	setLoading(true);

	setIsMovies(isMovies ? false : false);
	if (tvList.length === 0) {
		await funcTV(defaultLanguage).then((res: customRes | any | unknown) => {
			setTVList(res.tvShows.results as mediaType[] | []);
		});
	} else {
		setIsMovies(false);
	}

	setLoading(false);
};

type customRes = {
	response: {
		results: mediaType[];
	};
};

export const ResendVerifyEmail = async (
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(`/api/user/resendVerifyEmail?lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));
	return response;
};

export const GetScore = async () => {
	const response = await Fetch(`/api/user/getScore`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));
	return response;
};

export const AddRated = async (
	lang: AppContextTypes["defaultLanguage"],
	mediaId: number,
	media: "movie" | "tv",
	rating: number
) => {
	const response = await Fetch(
		`/api/rate/add?lang=${lang}&mediaId=${mediaId}&media=${media}&rating=${rating}`,
		{
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));
	return response;
};

export const GetLiked = async (lang: AppContextTypes["defaultLanguage"]) => {
	const response = await Fetch(`/api/user/getLiked?lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const GetWatched = async (lang: AppContextTypes["defaultLanguage"]) => {
	const response = await Fetch(`/api/user/getWatched?lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const DeleteOne = async (lang: AppContextTypes["defaultLanguage"]) => {
	const response = await Fetch(`/api/user/deleteOne?lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	});

	if (response.status === 200) {
		Cookies.remove("access-token");
	}

	return await response.json();
};

export const DeleteLiked = async (lang: AppContextTypes["defaultLanguage"]) => {
	const response = await Fetch(`/api/user/deleteLiked?lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const AccountFinder = async (
	username: string,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(
		`/api/user/accountFinder?lang=${lang}&username=${username}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const DiscordToken = async (
	token: string,
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(
		`/api/user/discord?lang=${lang}&token=${token}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const DeleteWatched = async (
	lang: AppContextTypes["defaultLanguage"]
) => {
	const response = await Fetch(`/api/user/deleteWatched?lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const MediaDetails = async (
	id: number,
	lang: AppContextTypes["defaultLanguage"],
	isMovies: boolean,
	season?: string,
	episode?: string
): Promise<object> => {
	const accessToken = Cookies.get("access-token");
	console.log(`accessToken`, accessToken, typeof accessToken);
	const response = await Fetch(
		`/api/${isMovies ? "movie" : "tv"}/details/${id}?lang=${lang}${isMovies ? "" : `&season=${season}&episode=${episode}`}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": accessToken,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const MediaPreview = async (
	id: number,
	lang: AppContextTypes["defaultLanguage"],
	isMovies: boolean,
	token: string
): Promise<object> => {
	const response = await Fetch(
		`/api/${isMovies ? "movie" : "tv"}/preview/${id}?lang=${lang}`,
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
		.catch((err) => console.log(err));

	return response;
};

export const MediaTrailer = async (
	id: number,
	isMovies: boolean
): Promise<object> => {
	const response = await Fetch(
		`/api/${isMovies ? "movie" : "tv"}/trailer/${id}`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return response;
};

export const FindAll = async (lang: AppContextTypes["defaultLanguage"]) => {
	const response = await Fetch(`/api/user/findAll?lang=${lang}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"access-token": Cookies.get("access-token"),
		},
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const ChangeRoleAdmin = async (
	lang: AppContextTypes["defaultLanguage"],
	id: string
) => {
	const response = await Fetch(
		`/api/user/changeRoleAdmin?lang=${lang}&id=${id}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};

export const DeleteOneAdmin = async (
	lang: AppContextTypes["defaultLanguage"],
	id: string
) => {
	const response = await Fetch(
		`/api/user/deleteOneAdmin?lang=${lang}&id=${id}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"access-token": Cookies.get("access-token"),
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	return response;
};
