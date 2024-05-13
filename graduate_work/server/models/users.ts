import { Schema, model, Model } from "mongoose";
import UserI from "./users.interface";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["user", "admin", "super-admin"],
		default: "user",
	},
	verified: {
		type: Boolean,
		default: false,
	},
	isPublic: {
		type: Boolean,
		default: true,
	},
	score: {
		type: Number,
		default: 0,
	},
	isWatch: {
		type: Boolean,
		default: true,
	},
	color: {
		type: String,
		enum: [`green`, `blue`, `red`, `yellow`, `purple`],
		required: true,
	},
	watched: [
		{
			id: { type: Number },
			media: { type: String, enum: ["movie", "tv"] },
			season: {
				type: Number,
				required: function (this: { media: "movie" | "tv" }) {
					return this.media === "tv";
				},
				default: function (this: { media: "movie" | "tv" }) {
					return this.media === "tv" ? 1 : undefined;
				},
			},
			episode: {
				type: Number,
				required: function (this: { media: "movie" | "tv" }) {
					return this.media === "tv";
				},
				default: function (this: { media: "movie" | "tv" }) {
					return this.media === "tv" ? 1 : undefined;
				},
			},
		},
	],
	liked: [
		{
			id: { type: Number },
			media: { type: String, enum: ["movie", "tv"] },
		},
	],
});

const User: Model<UserI> = model<UserI>("User", userSchema);

export default User;
