import env from "../config/env";
import Env from "../config/env.interface";
import TV from "../models/tv";
import TVI from "../models/tv.interface";

export const getTV = async (
	tvId: number,
	lang: "bg-BG" | "en-US"
): Promise<TVI> => {
	const { tvURL, accessToken } = env as Env;

	const response = await fetch(`${tvURL}/${tvId}?language=${lang}`, {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return await response.json();
};

export const saveTV = (tvDetails: TVI, lang: `bg-BG` | `en-US`) => {
	const {
		adult,
		created_by,
		episode_run_time,
		first_air_date,
		genres,
		homepage,
		id,
		in_production,
		name,
		networks,
		number_of_episodes,
		number_of_seasons,
		origin_country,
		original_name,
		overview,
		popularity,
		poster_path,
		production_companies,
		production_countries,
		seasons,
		status,
		type,
		vote_average,
		vote_count,
	} = tvDetails;

	const filteredSeasons = seasons.filter(
		(season: any) => season.name !== "Specials" && season.name !== "Специални"
	);

	const newTV = new TV({
		adult: adult,
		created_by: created_by.map((creator: any) => ({
			id: creator.id,
			name: creator.name,
		})),
		episode_run_time: episode_run_time,
		first_air_date: first_air_date,
		genres: genres.map((genre: any) => ({
			id: genre.id,
			name: genre.name,
		})),
		homepage: homepage,
		id: id,
		in_production: in_production,
		name: name,
		networks: networks.map((network: any) => ({
			id: network.id,
			name: network.name,
		})),
		number_of_episodes: number_of_episodes,
		number_of_seasons: number_of_seasons,
		origin_country: origin_country,
		original_name: original_name,
		overview: overview,
		popularity: popularity,
		poster_path: poster_path,
		production_companies: production_companies.map((company: any) => ({
			id: company.id,
			name: company.name,
		})),
		production_countries: production_countries.map((country: any) => ({
			iso_3166_1: country.iso_3166_1,
			name: country.name,
		})),
		seasons: filteredSeasons.map((season: any) => ({
			air_date: season.air_date,
			episode_count: season.episode_count,
			id: season.id,
			name: season.name,
			season_number: season.season_number,
		})),
		status: status,
		type: type,
		vote_average: vote_average,
		vote_count: vote_count,
		lang: lang,
	}) as TVI;
	return newTV;
};

export const findTV = async (id: string, lang: string): Promise<TVI | null> => {
	try {
		return (await TV.findOne({ id: id, lang: lang }).lean().exec()) as TVI;
	} catch (err) {
		return null;
	}
};

export const saveTVTwoLanguages = async (
	id: number,
	lang: "bg-BG" | "en-US",
	sec: "bg-BG" | "en-US"
) => {
	const tvSet = new Set();

	const langTV = saveTV(await getTV(id, lang), lang);

	tvSet.add(langTV);
	tvSet.add(saveTV(await getTV(id, sec), sec));

	await TV.insertMany(Array.from(tvSet));

	return langTV;
};

export const processTVs = async (tv: TVI[], lang: "bg-BG" | "en-US") => {
	const exists = await TV.find({
		id: { $in: tv.map((m) => m.id) },
		lang: lang,
	});

	const tvSet = new Set();

	const arr = tv.filter((m) => !exists.some((e) => e.id === m.id)) as TVI[];

	for (let i = 0; i < arr.length; i++) {
		const bgMovie = saveTV(await getTV(arr[i].id, `bg-BG`), `bg-BG`);
		const enMovie = saveTV(await getTV(arr[i].id, `en-US`), `en-US`);

		tvSet.add(bgMovie);
		tvSet.add(enMovie);
	}

	const filteredTvs = new Set(Array.from(tvSet).filter((tv : any) => (
		tv.first_air_date !== '' &&
		tv.first_air_date !== null &&
		tv.poster_path !== '' &&
		tv.poster_path !== null &&
		tv.number_of_episodes !== 0 &&
		tv.number_of_episodes !== null &&
		tv.number_of_episodes !== ""
	)));

	await TV.insertMany(Array.from(filteredTvs));
};

export const recTVs = async (
	id: number,
	lang: "bg-BG" | "en-US"
): Promise<TVI[] | null> => {
	const { tvURL, accessToken } = env as Env;

	const response = await fetch(
		`${tvURL}/${id}/recommendations?language-${lang}&page=1`,
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

	const tvs = response.results.slice(0, 10);
	await processTVs(tvs, lang);

	return tvs;
};
