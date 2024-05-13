import { Document, Schema } from "mongoose";

export interface RatedI extends Document {
    user: Schema.Types.ObjectId;
    mediaId: number;
    media: "movie" | "tv";
    rating: number;
}