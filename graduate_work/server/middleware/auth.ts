import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import env from "../config/env";
import Env from "../config/env.interface";
import { RequestUserI } from "../utils/user";

interface RequestType extends Request {
	user?: RequestUserI;
	token?: string;
}

const auth = async (req: RequestType, res: Response, next: NextFunction) => {
	try {
		// console.log(req.headers);
		const { JWT_SECRET_KEY } = env as Env;

		const accessToken = req.headers["access-token"] as string;

		if (accessToken === 'undefined') {
			return res.status(401).json({ status: 401, message: "No Access Token" });
		}

		const decoded = jwt.verify(
			accessToken,
			JWT_SECRET_KEY as string
		) as unknown as { user: RequestUserI };

		const user = decoded.user;

		if (!user) {
			return res.status(401).json({ status: 401, message: "No user" });
		}

		req.user = user;

		next();
	} catch (err) {
		return res
			.status(401)
			.json({ status: 401, message: "Error Authenticating" });
	}
};

export default auth;
