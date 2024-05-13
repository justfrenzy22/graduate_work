import { Schema, model, Model } from "mongoose";
import GenreInterface from "./genre.interface";


const GenreTVSchema = new Schema({
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

const GenreTV: Model<GenreInterface> = model<GenreInterface>('Genre', GenreTVSchema);

export default GenreTV;