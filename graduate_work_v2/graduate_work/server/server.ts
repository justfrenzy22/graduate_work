import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import crypto from "crypto";
require("dotenv").config();

import movieRouter from "./routes/movie.route";
import tvRouter from "./routes/tv.route";
import userRouter from "./routes/users.route";
import filterRouter from "./routes/filter.route";
import countryRouter from "./routes/country.route";
import rateRouter from './routes/rated.route';
import commentRouter from './routes/comment.route';

import env from "./config/env";
import Env from "./config/env.interface";
import siteAuth from "./middleware/siteAuth";
import fetch from "node-fetch";

// kon be kon
// dii kokose

const { PORT, URL, connString, authUser, authPass, db } = env as Env;

//MongoDB connection
mongoose
	.connect(`${connString}${authUser}:${authPass}@${URL}:27017`, {
		dbName: db,
	})
	.then(() => console.log(`> Successfully connected to Database`))
	.catch((err: Error) => console.error(`Error\n`, err));

const app = express();

// app use CORS
app.use(
	cors({
		origin: [
			"https://crackflix.site",
			"localhost:3000",
			"localhost:5000",
			// "http://localhost:3000",
			// "http://192.168.0.101:3000",
		],
	})
);

app.use(express.json());
// middleware to check the source of the request if it is from my website or not
app.use(siteAuth);

// app use routes
app.use("/movie", movieRouter);
app.use("/tv", tvRouter);
app.use("/user", userRouter);
app.use("/filter", filterRouter);
app.use('/country', countryRouter);
app.use('/rate', rateRouter);
app.use('/comment/', commentRouter)

const options = {
	key: fs.readFileSync("./server.key"),
	cert: fs.readFileSync("./server.cert"),
};

const server = https.createServer(options, app);

app.get("/", (req, res) => {
	res.send(`> Server on\n> Listening on ${PORT}\n> https://${URL}:${PORT}`);
});

app.get("/asd", async (req: Request, res: Response) => {
	const { accessToken } = env as Env;
	const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_keywords=9715`, {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	}).then(res => res.json()).catch(err => console.error(err));
	res.json({ status: 200, message: crypto.randomBytes(32).toString("hex"), data: response });
});

server.listen(PORT, () => {
	console.log(
		`\n> Server on\n> Listening on ${PORT}\n> https://${URL}:${PORT}`
	);
});
