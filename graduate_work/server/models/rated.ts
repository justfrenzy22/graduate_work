import { Model, model, Schema } from "mongoose";
import { RatedI } from "./rated.interface";

const ratedSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	mediaId: {
		type: Number,
		required: true,
	},
	media: {
		type: String,
		enum: ["movie", "tv"],
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
});

const Rated: Model<RatedI> = model<RatedI>(`Rated`, ratedSchema);

export default Rated;
