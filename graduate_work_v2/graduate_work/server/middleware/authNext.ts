import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import env from "../config/env";
import Env from "../config/env.interface";
import { RequestUserI } from "../utils/user";

export interface RequestI extends Request {
	user?: RequestUserI;
	isAuth?: boolean;
}

const authNext = async (req: RequestI, res: Response, next: NextFunction) => {
	const { JWT_SECRET_KEY } = env as Env;

	try {
		const accessToken = req.headers['access-token'];
		if (accessToken === 'undefined') {
			req.isAuth = false;
			next();
		} else {
			const decoded = jwt.verify(accessToken as any, JWT_SECRET_KEY) as unknown as {
				user: RequestUserI;
			};

			const user = decoded.user;

			if (!user) {
				req.isAuth = false;
				next();
			}

			req.user = user;
			req.isAuth = true;
			next();
		}
	} catch (err) {
		console.error(`banata`, err);
		return res
			.status(401)
			.json({ status: 401, message: "Error Authenticating" });
	}
};

export default authNext;
