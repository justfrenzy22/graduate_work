import { Schema, model, Model } from "mongoose";
import CountryI from "./country.interface";

const CountrySchema = new Schema({
	iso_3166_1: {
		type: String,
		required: true,
		unique: true,
	},
	english_name: {
		type: String,
		required: true,
		unique: true,
	},
	native_name: {
		type: String,
		required: true,
		unique: true,
	},
});

const Country: Model<CountryI> = model<CountryI>("Country", CountrySchema);

export default Country;
