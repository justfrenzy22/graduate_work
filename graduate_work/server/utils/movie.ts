import fetch from "node-fetch";
import env from "../config/env";
import Env from "../config/env.interface";
import Movie from "../models/movie";
import MovieI from "../models/movie.interface";

export const getMovie = async (
	movieId: number,
	lang: "bg-BG" | "en-US"
): Promise<MovieI> => {
	const { movieURL, accessToken } = env as Env;

	const response = await fetch(`${movieURL}/${movieId}?language=${lang}`, {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return await response.json();
};

export const saveMovie = (movieDetails: MovieI, lang: `bg-BG` | `en-US`) => {
	const {
		adult,
		genres,
		homepage,
		id,
		imdb_id,
		original_title,
		overview,
		popularity,
		poster_path,
		production_companies,
		production_countries,
		release_date,
		runtime,
		status,
		title,
		vote_average,
		vote_count,
	}: MovieI = movieDetails;

	const newMovie = new Movie({
		adult: adult,
		genres: genres
			? genres.map((genre: any) => ({ id: genre.id, name: genre.name }))
			: [],
		homepage: homepage,
		id: id,
		imdb_id: imdb_id,
		original_title: original_title,
		overview: overview,
		popularity: popularity,
		poster_path: poster_path,
		production_companies: production_companies
			? production_companies.map((company: any) => ({
					id: company.id,
					name: company.name,
			  }))
			: [],
		production_countries: production_countries ? production_countries.map((country: any) => ({
			iso_3166_1: country.iso_3166_1,
			name: country.name,
		})) : [],
		release_date: release_date,
		runtime: runtime,
		status: status,
		title: title,
		vote_average: vote_average,
		vote_count: vote_count,
		lang: lang,
	}) as MovieI;
	return newMovie;
};

export const findMovie = async (
	id: string,
	lang: string
): Promise<MovieI | null> => {
	try {
		return (await Movie.findOne({ id: id, lang: lang })
			.lean()
			.exec()) as MovieI;
	} catch (err) {
		return null;
	}
};

export const saveMovieTwoLanguages = async (
	id: number,
	lang: "bg-BG" | "en-US",
	sec: "bg-BG" | "en-US"
) => {
	const movieSet = new Set();

	const langMovie = saveMovie(await getMovie(id, lang), lang);

	movieSet.add(langMovie);
	movieSet.add(saveMovie(await getMovie(id, sec), sec));

	await Movie.insertMany(Array.from(movieSet));

	return langMovie;
};

export const processMovies = async (
	movies: MovieI[],
	lang: "bg-BG" | "en-US"
) => {
	const exists = await Movie.find({
		id: { $in: movies.map((m) => m.id) },
		lang: lang,
	});

	const movieSet = new Set();

	const arr = movies.filter(
		(m) => !exists.some((e) => e.id === m.id)
	) as MovieI[];

	for (let i = 0; i < arr.length; i++) {
		const bgMovie = saveMovie(await getMovie(arr[i].id, `bg-BG`), `bg-BG`);
		const enMovie = saveMovie(await getMovie(arr[i].id, `en-US`), `en-US`);

		movieSet.add(bgMovie);
		movieSet.add(enMovie);
	}

	const filteredMovies = new Set(
		Array.from(movieSet).filter(
			(movie: any) =>
				movie.release_date !== "" &&
				movie.release_date !== null &&
				movie.poster_path !== "" &&
				movie.genres !== undefined &&
				movie.genres.length > 0 &&
				movie.production_companies !== undefined &&
				movie.production_companies.length > 0 &&
				movie.production_countries !== undefined &&
				movie.production_countries.length > 0 &&
				movie.poster_path !== null &&
				movie.status !== "Planned"
		)
	);

	await Movie.insertMany(Array.from(filteredMovies));
};

// recommendation movies
export const recMovies = async (
	id: number,
	lang: "bg-BG" | "en-US"
): Promise<MovieI[] | null> => {
	const { movieURL, accessToken } = env as Env;

	const response = await fetch(
		`${movieURL}/${id}/recommendations?language-${lang}&page=1`,
		{
			method: `GET`,
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	const movies = response.results.slice(0, 10);
	await processMovies(movies, lang);

	return movies;
};
