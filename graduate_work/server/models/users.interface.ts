import { ObjectId, Document } from "mongoose";

interface UserI extends Document {
	_id: ObjectId;
	username: string;
	email: string;
	password: string;
	role: "user" | "admin" | 'super-admin';
	isPublic: boolean;
	score: number;
	verified: boolean;
	isWatch: boolean;
	color: "green" | "blue" | "red" | "yellow" | "purple";
	watched: Array<{
		id: Number;
		media: "movie" | "tv";
		season: Number;
		episode: Number;
	}>;
	liked: Array<{ id: Number; media: "movie" | "tv" }>;
}

export default UserI;
