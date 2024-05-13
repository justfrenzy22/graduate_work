import { Document } from "mongoose";


interface TVI extends Document {
	media_type: string;
    adult: boolean,
    check: boolean;
    rating: number,
    created_by: Array<{ id: number, name: string }>,
    episode_run_time: number[],
    first_air_date: string,
    genres: Array<{ id: number, name: string }>,
    homepage: string,
    id: number,
    in_production: boolean,
    name: string,
    networks: Array<{ id: number, name: string }>,
    number_of_episodes: number,
    number_of_seasons: number,
    origin_country: string[],
    original_name: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: Array<{ id: number, name: string }>,
    production_countries: Array<{ iso_3166_1: string, name: string }>,
    seasons: Array<{ air_date: string, episode_count: number, id: number, name: string, season_number: number }>,
    status: string,
    type: string,
    vote_average: number,
    vote_count: number,
    lang: string,
};


export default TVI;
