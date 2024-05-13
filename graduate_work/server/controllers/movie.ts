import Movie from '../models/movie';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import env from '../config/env';
import Env from '../config/env.interface';
import handle from '../view/movie';
import { findMovie, processMovies, saveMovieTwoLanguages } from '../utils/movie';
import MovieI from '../models/movie.interface';

interface QueryParams {
	lang: 'bg-BG' | 'en-US';
	time_window: string;
	page: number;
}

// const fetchMovieDetails = async (movieId: string, lang: string) => {
// 	const { movieURL, accessToken } = env;

// 	try {
// 		const response = await fetch(
// 			`${movieURL}/${movieId}?language=${lang}`,
// 			{
// 				method: 'GET',
// 				headers: {
// 					accept: 'application/json',
// 					Authorization: `Bearer ${accessToken}`,
// 				},
// 			}
// 		);

// 		return await response.json();
// 	} catch (err) {
// 		console.error(err);
// 		throw err;
// 	}
// };

// const saveMovie = async (
// 	movieDetails: MovieInterface,
// 	lang: string
// ): Promise<void> => {
// 	const {
// 		adult,
// 		genres,
// 		homepage,
// 		id,
// 		imdb_id,
// 		original_title,
// 		overview,
// 		popularity,
// 		poster_path,
// 		production_companies,
// 		production_countries,
// 		release_date,
// 		runtime,
// 		status,
// 		title,
// 		vote_average,
// 		vote_count,
// 	}: MovieInterface = movieDetails;

// 	const newMovie = new Movie({
// 		adult: adult,
// 		genres: genres.map((genre: any) => ({
// 			id: genre.id,
// 			name: genre.name,
// 		})),
// 		homepage: homepage,
// 		id: id,
// 		imdb_id: imdb_id,
// 		original_title: original_title,
// 		overview: overview,
// 		popularity: popularity,
// 		poster_path: poster_path,
// 		production_companies: production_companies.map((company: any) => ({
// 			id: company.id,
// 			name: company.name,
// 		})),
// 		production_countries: production_countries.map((country: any) => ({
// 			iso_3166_1: country.iso_3166_1,
// 			name: country.name,
// 		})),
// 		release_date: release_date,
// 		runtime: runtime,
// 		status: status,
// 		title: title,
// 		vote_average: vote_average,
// 		vote_count: vote_count,
// 		lang: lang,
// 	}) as MovieInterface;
// 	try {
// 		await newMovie.save();
// 	} catch (err) {
// 		throw err;
// 	}
// };

// export const saveMovieWithMultipleLanguages = async (
// 	movieId: string,
// 	type: string,
// 	...languages: string[]
// ): Promise<void | object> => {
// 	const fetchAndSaveDetails = async (lang: string) => {
// 		const details = await fetchMovieDetails(movieId, lang);
// 		await saveMovie(details, lang);
// 		return details;
// 	}

// 	if (type === 'details') {
// 		const [mainLangDetails, secondLangDetails] = await Promise.all([
// 			fetchAndSaveDetails(languages[0]),
// 			fetchAndSaveDetails(languages[1]),
// 		]);
// 		return mainLangDetails;
// 	} else {
// 		await Promise.all(languages.map(fetchAndSaveDetails));
// 	}
// };

// export const findMovie = async (
// 	id: string,
// 	lang: string
// ): Promise<MovieInterface | null> => {
// 	// console.log(`id`, id, `lang`, lang);
// 	try {
// 		return (await Movie.findOne({ id, lang }).lean().exec()) as MovieInterface | null;
// 	} catch (err) {
// 		// console.log(`aaaaaaaaaaaaaah e tuka`, err);
// 		return null;
// 	}
// };

const details = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { lang } = req.query as unknown as QueryParams;

	const ID = parseInt(id);

	if (isNaN(ID)) return handle.internalError(res);

	const find: MovieI | null = await findMovie(id, lang);
	const { bg, en } = env as Env;
	const isLangBg = lang === bg ? true : false;

	

	if (find) {
		return handle.movieExists(res, find);
	} else {
		try {
			const langMovie = await saveMovieTwoLanguages(
				ID,
				lang,
				isLangBg ? bg : en
			)
			return handle.createdMovie(res, langMovie);
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
		const trailers = await fetch(
			`${movieURL}/${id}/videos?language=en-US`,
			{
				method: 'GET',
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)
			.then((res) => res.json())
			.catch((err) => console.error(err));

		return res.status(200).json({
			message: 'Trailers fetched successfully',
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
			method: 'GET',
			headers: {
				accept: 'application/json',
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
	// console.log(`goes here please`, req.query);

	const response = await PopularTrendingFetchMovies(
		movieURL,
		'popular',
		lang,
		page,
		res
	);

	if (!response) return handle.internalError(res);
	
	await processMovies(response.results, lang);

	return handle.moviesFetched(res, response);
	// const movies = response.results;
	// await Promise.all(
	// 	movies.map(async (movie: any) => {
	// 		const find = await findMovie(movie.id, lang);
	// 		// console.log(`loading`, find);
	// 		if (!find) {
	// 			try {
	// 				await saveMovieWithMultipleLanguages(
	// 					movie.id,
	// 					'popular',
	// 					bg,
	// 					en
	// 				);
	// 			} catch (err) {
	// 				console.error(`Error fetching or saving movie: ${err}`);
	// 			}
	// 		}
	// 	})
	// );
	// return handle.moviesFetched(res, response);
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
	// const movies = response.results;
	// await Promise.all(
	// 	movies.map(async (movie: any) => {
	// 		const find = await findMovie(movie.id, lang);
	// 		if (!find) {
	// 			try {
	// 				await saveMovieWithMultipleLanguages(
	// 					movie.id,
	// 					'trending',
	// 					bg,
	// 					en
	// 				);
	// 			} catch (err) {
	// 				console.error(`Error fetching or saving movie: ${err}`);
	// 			}
	// 		}
	// 	})
	// );
	// return handle.moviesFetched(res, response);
};

const nowPlaying = async (req: Request, res: Response) => {
	const { movieURL }: Env = env;
	const { lang, page } = req.query as unknown as QueryParams;

	const response = await PopularTrendingFetchMovies(
		movieURL,
		'now_playing',
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
	movieTrailer,
	popular,
	trending,
	nowPlaying,
	findAll,
	deleteAll,
};
// import Movie from "../models/movie";
// import { Request, Response } from "express";
// import fetch from 'node-fetch';
// import MovieInterface from "../models/movie.interface";

// // env file variables
// // const lang = process.env.lang;
// // const movieURL = process.env.movieURL;
// // const accessToken = process.env.accessToken;

// const fetchMovieDetails = async (movieId : string, lang : string) => {
//     const movieURL = process.env.movieURL;
//     const accessToken = process.env.accessToken;
//     // const lang = process.env.lang;
//     // const bg = process.env.bg;

//     const response = await fetch(`${movieURL}/${movieId}?language=${lang}`, {
//         method: "GET",
//         headers: {
//             accept: 'application/json',
//             Authorization: `Bearer ${accessToken}`
//         }
//     }).then(res => res.json())
//     .catch(err => console.error(err));
//     return response;
// };

// const saveMovie = async (movieDetails : any, lang: string) : Promise<void> => {
//     const newMovie : MovieInterface = new Movie({
//         adult: movieDetails.adult,
//             genres: movieDetails.genres.map((genre : any) => ({
//                 id: genre.id,
//                 name: genre.name
//             })),
//             homepage: movieDetails.homepage,
//             id: movieDetails.id,
//             imdb_id: movieDetails.imdb_id,
//             original_title: movieDetails.original_title,
//             overview: movieDetails.overview,
//             popularity: movieDetails.popularity,
//             poster_path: movieDetails.poster_path,
//             production_companies: movieDetails.production_companies.map((company : any) => ({
//                 id: company.id,
//                 name: company.name
//             })),
//             production_countries: movieDetails.production_countries.map((country : any) => ({
//                 iso_3166_1: country.iso_3166_1,
//                 name: country.name
//             })),
//             release_date: movieDetails.release_date,
//             runtime: movieDetails.runtime,
//             status: movieDetails.status,
//             title: movieDetails.title,
//             vote_average: movieDetails.vote_average,
//             vote_count: movieDetails.vote_count,
//             lang: lang
//     });
//     newMovie.save();

//     return;
// }

// const saveMovieWithMultipleLanguages = async (id : string, bg : string, en : string) : Promise<void> => {
//     const resp = await fetchMovieDetails(id, bg);
//     await saveMovie(resp, bg);
//     const resp1 = await fetchMovieDetails(id, en);
//     await saveMovie(resp1, en);
// }

// const findMovie = async (id : string): Promise<MovieInterface | null> => await Movie.findOne({ id }).lean().exec() as MovieInterface | null;

// const details =  async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const find: MovieInterface | null = await findMovie(id);
//     const bg = process.env.bg as string;
//     const en = process.env.en as string;

//     if (find) {
//         return res.status(409).json({ message: 'Movie already exists' });
//     }
//     else {
//         try {
//             // const resp = await fetchMovieDetails(id, bg);
//             await saveMovieWithMultipleLanguages(id, bg, en);
//             // await saveMovie(resp, bg);
//             // const resp1 = await fetchMovieDetails(id, en);
//             // await saveMovie(resp1, en);
//             return res.status(200).json({ message: 'Movie created successfully' });

//         } catch (err) {
//             console.log(`err`, err);
//             return res.status(500).json({ message: 'Internal server error' });
//         }
//     }
// }

// const popular = async (req : Request, res : Response) => {
//     const movieURL = process.env.movieURL;
//     const accessToken = process.env.accessToken;
//     const bg = process.env.bg;

//     try {
//         const response = await fetch(`${movieURL}/popular?language=${bg}&page=1` , {
//             method: "GET",
//             headers: {
//                 accept: 'application/json',
//                 Authorization: `Bearer ${accessToken}`
//             },
//         }).then(res => res.json())
//         .catch(err => console.error(err));

//         const movies  = response.results;
//         await Promise.all(movies.map(async (movie : any) => {
//             const find = await findMovie(movie.id);
//             if (!find) {
//                 try {

//                     // const resp = await fetchMovieDetails(movie.id);
//                     await saveMovieWithMultipleLanguages(movie.id, process.env.bg as string, process.env.en as string);
//                     // await saveMovie(resp);

//                 } catch (err) {
//                     console.error(`Error fetching or saving movie: ${err}`);
//                 }
//             }
//         }))

//         return res.status(200).json(response);

//     } catch (err) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// }


//                 accept: 'application/json',
//                 Authorization: `Bearer ${accessToken}`
//             }
//         }).then(res => res.json())
//         .catch(err => console.error(err));
//         const movies = response.results;
//         await Promise.all(movies.map(async (movie : any) => {
//             const find = await findMovie(movie.id);
//             if (!find) {
//                 try {
//                     // const resp = await fetchMovieDetails(movie.id);
//                     await saveMovieWithMultipleLanguages(movie.id, process.env.bg as string, process.env.en as string);
//                     // await saveMovie(resp);
//                 } catch (err) {
//                     console.error(`Error fetching or saving movie: ${err}`);
//                 }
//             }
//         }))
//         return res.status(200).json({ data: response, message: 'Movies fetched successfully' });
//     } catch (err) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// }

// const findAll = async (req : Request, res: Response) => {
//     const findAll = await Movie.find({});
//     res.status(200).json({ data: findAll, message: 'Movies fetched successfully' });
// };


// export default {
//     details,
//     popular,
//     findAll,
//     deleteAll,
//     trending,
// };
