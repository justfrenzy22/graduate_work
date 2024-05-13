import { Document } from "mongoose";

interface CountryI extends Document {
	iso_3166_1: string;
	english_name: string;
	native_name: string;
}

export default CountryI;
