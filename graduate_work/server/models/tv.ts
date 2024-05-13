import { Schema, model, Model } from 'mongoose';
import TVI from './tv.interface';

const tvSchema = new Schema({
    adult: {
        type: Boolean,
        required: true,
    },
    created_by: [{
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required:true,
        },
    }],
    episode_run_time: {
        type: [Number],
        required: true,
    },
    first_air_date: {
        type: String,
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
    in_production: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    networks: [{
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }],
    number_of_episodes: {
        type: Number,
        required: true,
    },
    number_of_seasons: {
        type: Number,
        required: true,
    },
    origin_country: {
        type: [String],
        required: true,
    },
    original_name: {
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
    seasons: [{
        air_date: {
            type: String,
        },
        episode_count: {
            type: Number,
            required: true,
        },
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        season_number: {
            type: Number,
            required: true,
        },
    }],
    status: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    vote_average: {
        type: Number,
        required: true,
    },
    vote_count: {
        type: Number,
        required: true,
    },
    lang: {
        type: String,
        required: true,
    }
});


// interface TVGenre {
//     id: number,
//     name: string,
// };


// interface TVNetwork {
//     id: number,
//     name: string,
// };


// interface TVProductionCompany {
//     id: number,
//     name: string,
// };


// interface TVSeason {
//     air_date: string,
//     episode_count: number,
//     id: number,
//     name: string,
//     season_number: number,
// };


// export interface TVInterface extends Document {
//     adult: boolean,
//     created_by: Array<{ id: number, name: string }>,
//     first_air_date: string,
//     genres: TVGenre[],
//     homepage: string,
//     id: number,
//     in_production: boolean,
//     name: string,
//     networks: TVNetwork[],
//     number_of_episodes: number,
//     number_of_seasons: number,
//     origin_country: string[],
//     original_name: string,
//     overview: string,
//     popularity: number,
//     poster_path: string,
//     production_companies: TVProductionCompany[],
//     seasons: TVSeason[],
//     status: string,
//     type: string,
//     vote_average: number,
//     vote_count: number,
// };
// 22

const TV : Model<TVI> = model<TVI>('TV', tvSchema);


export default TV;