import { NextFunction, Request, Response } from "express";
import env from "../config/env";
import Env from "../config/env.interface";

const siteAuth = (req: Request, res: Response, next: NextFunction) => {
	const { siteAPIKey } = env as Env;
	const siteApiKey = req.headers["site-api-key"] as string;

	if (siteApiKey !== siteAPIKey) {
		return res.status(403).json({ status: 403, message: "Forbidden" });
	}

	next();
};
export default siteAuth;
