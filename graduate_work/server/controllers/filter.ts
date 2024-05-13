import { Request, Response } from 'express';
import TV from '../models/tv';
import Movie from '../models/movie';
import env from '../config/env';
import Env from '../config/env.interface';
import handle from '../view/filter';
import User from '../models/users';
import auth from '../middleware/auth';
import { findMovie, saveMovieWithMultipleLanguages } from './movie';
import { findTV, saveTVWithMultipleLanguages } from './tv';
import UserInterface from '../models/users.interface';

type searchProps = {
	keyword: string,
	type: 'tv' | 'movie' | 'multi',
	genre: string | Array<string>,
	country: string | Array<string>,
	year: string,
	rating: string,
	page: string,
	lang: 'bg-BG' | 'en-US',
	res: Response,
}

interface RequestType extends Request {
	user?: userAccessType;
	token?: string;
	auth: boolean;
};

type userAccessType = {
	_id: string,
	email: string,
	role: 'user' | 'admin',
	username: string,
}

const filter = async (req: Request, res: Response) => {
	const { keyword, type, genre, country, year, rating, page, lang } =
		req.query as {
			keyword: string;
			type: 'tv' | 'movie' | 'multi';
			genre: string | Array<string>;
			country: string | Array<string>;
			year: string;
			rating: string;
			page: string;
			lang: 'bg-BG' | 'en-US';
		};



	const pageNum = Number(page) as number;

	if (isNaN(pageNum)) {
		return res.json({
			status: 400,
			message: 'Page must be a valid number.',
		});
	}

	const props = {
		keyword: keyword,
		type: type,
		genre: genre,
		country: country,
		year: year,
		rating: rating,
		page: page,
		lang: lang,
		res: res,
	} as unknown as searchProps;

	const disProps = {
		type: type,
		genre: genre,
		country: country,
		year: year,
		rating: rating,
		page: page,
		lang: lang,
		res: res,
	} as unknown as searchProps;

	keyword ? await searchAndFilter(props) : await discoverAndFilter(disProps as searchProps);
};

const searchAndFilter = async (props: searchProps) => {
	const { keyword, type, genre, country, year, rating, lang, page, res } = props as searchProps;

	type === 'tv'
		? await typeSearch(keyword, 'tv', lang, page, res)
		: type === 'movie'
			? await typeSearch(keyword, 'movie', lang, page, res)
			: await typeSearch(keyword, 'multi', lang, page, res);
};

const discoverAndFilter = async (props: searchProps) => {
	// Implement discover functionality using type and apply filtering
};

const typeSearch = async (
	keyword: string,
	path: string,
	lang: 'bg-BG' | 'en-US',
	page: string,
	res: Response
) => {
	const { searchURL, accessToken } = env as Env;

	const apiUrl =
		`${searchURL}/${path}?query=${keyword}&include_adult=false&language=${lang}&page=${page}` as string;
	try {
		// console.log(apiUrl);
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((resp) => resp.json())
			.catch((err) => console.error(err));
		if (response.total_results <= 0) {
			return handle.notFound(res, lang);
		}
		return handle.success(res, response);
	} catch (err) {
		return handle.internalError(res, lang);
	}
};

const quickSearch = async (req: Request, res: Response) => {
	const { keyword, lang } = req.query as unknown as {
		keyword: string;
		lang: 'bg-BG' | 'en-US';
	};

	// let user: UserInterface;
	// if (req.auth) {
	// 	user = await User.find({}) as undefined as UserInterface;
	// }

	const { searchURL, accessToken } = env as Env;

	const apiUrl =
		`${searchURL}/multi?query=${keyword}&include_adult=false&language=${lang}&page=${1}` as string;

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((resp) => resp.json())
			.catch((err) => console.error(err));


		if (response.total_results <= 0) {
			return handle.notFound(res, lang);
		}


		// if (response.total_results < 5) {
		// 	for (let i = 0; i < response.total_results; i++) {
		// 		if (response.results[i].media_type === 'movie') {
		// 			const movie = await findMovie(response.results[i].id, 'bg-BG');
		// 			if (!movie) {
		// 				await saveMovieWithMultipleLanguages(response.results[i].id, 'somethingElse', `bg-BG`, `en-US`);
		// 			}
		// 		}
		// 		else if (response.results[i].media_type === 'tv') {
		// 			const tv = await findTV(response.results[i].id, 'bg-BG');
		// 			if (!tv) {
		// 				await saveTVWithMultipleLanguages(response.results[i].id, 'somethingElse', `bg-BG`, `en-US`);
		// 			}
		// 		}
		// 		if (req.auth) {
		// 			const reqEmail = req.user?.email;
		// 			const user: UserInterface = await User.find({ reqEmail }) as unknown as UserInterface;

		// 			const arr = user.watchlist as [] as UserInterface['watchlist'];
					

		// 		}
		// 	}
		// }
		// else {
		// 	for (let i = 0; i < 5; i++) {
		// 		if (response.results[i].media_type === 'movie') {
		// 			const movie = await findMovie(response.results[i].id, 'bg-BG');
		// 			if (!movie) {
		// 				await saveMovieWithMultipleLanguages(response.results[i].id, 'somethingElse', `bg-BG`, `en-US`);
		// 			}
		// 		}
		// 		else if (response.results[i].media_type === 'tv') {
		// 			const tv = await findTV(response.results[i].id, 'bg-BG');
		// 			if (!tv) {
		// 				await saveTVWithMultipleLanguages(response.results[i].id, 'somethingElse', `bg-BG`, `en-US`);
		// 			}
		// 		}

		// 	}
		// }

		return handle.success(res, response);
	} catch (err) {
		console.log(`Error`, err);
		return handle.internalError(res, lang);
	}
}



const emptyFilter = async (req: Request, res: Response) => {
	const { lang } = req.query as unknown as {
		lang: 'bg-BG' | 'en-US';
	};


	const { discoverURL, accessToken } = env as Env;
	//https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1
	//https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1
	const apiUrl =
		`${discoverURL}/movie?include_adult=false&language=${lang}&page=${1}` as string;

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((resp) => resp.json())
			.catch((err) => console.error(err));

		// console.log(`goes here`, response);

		if (response.total_results <= 0) {
			return handle.notFound(res, lang);
		}


		return handle.success(res, response);
	} catch (err) {
		console.log(`Error`, err);
		return handle.internalError(res, lang);
	}
}

const discover = (props: searchProps) => {
	const { country, genre, lang, page, rating, type, year, res } = props as searchProps;

	const { discoverURL, accessToken } = env as Env;

	const apiUrl =
		`${discoverURL}/${type}`

}

export default {
	filter,
	quickSearch,
	emptyFilter,
};
