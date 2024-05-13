import { Schema, model, Model } from 'mongoose';
import MovieI from './movie.interface';

const movieSchema = new Schema({
    adult: {
        type: Boolean,
        required: true,
    },
    genres: [{
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }],
    homepage: {
        type: String,
    },
    id: {
        type: Number,
        required: true,
    },
    imdb_id: {
        type: String,
    },
    original_title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
    },
    popularity: {
        type: Number,
        required: true,
    },
    poster_path: {
        type: String,
        required: true
    },
    production_companies: [{
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }],
    production_countries: [{
        iso_3166_1: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }],
    release_date: {
        type: String,
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    vote_average: {
        type: String,
        required: true,
    },
    vote_count: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    }
});


const Movie : Model<MovieI> = model<MovieI>('Movie', movieSchema);


export default Movie;
// director is always N/A