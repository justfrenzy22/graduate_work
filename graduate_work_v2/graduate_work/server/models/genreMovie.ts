import { Schema, model, Model } from "mongoose";
import GenreInterface from "./genre.interface";


const GenreMovieSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    english_name: {
        type: String,
        required: true,
        unique: true,
    }
});

const GenreMovie: Model<GenreInterface> = model<GenreInterface>('Genre', GenreMovieSchema);

export default GenreMovie;