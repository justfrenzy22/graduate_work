import { Document } from 'mongoose';


interface MovieI extends Document {
	media_type: string;
	check: boolean;
    rating: number,
    adult: boolean,
    genres: Array<{ id: number, name: string }>,
    homepage: string,
    id: number,
    imdb_id: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: Array<{ id: number, name: string }>,
    production_countries: Array<{ iso_3166_1: string, name: string }>
    release_date: string,
    runtime: number,
    status: string,
    title: string,
    vote_average: number,
    vote_count: number,
    lang: string
}


export default MovieI;