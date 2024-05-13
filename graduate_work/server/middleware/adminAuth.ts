import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import env from "../config/env";
import Env from "../config/env.interface";

interface RequestType extends Request {
	user?: userAccessType;
	token?: string;
}

type userAccessType = {
	_id: string;
	email: string;
	role: "user" | "admin";
	username: string;
};

const adminAuth = async (req: RequestType, res: Response, next: NextFunction) => {
	try {
		// console.log(req.headers);
		const { JWT_SECRET_KEY } = env as Env;

		const accessToken = req.headers["access-token"] as string;

		if (!accessToken) {
			return res.status(401).json({ status: 401, message: "No Access Token" });
		}

		const decoded = jwt.verify(
			accessToken,
			JWT_SECRET_KEY as string
		) as unknown as { user: userAccessType };

		const user = decoded.user;

		if (!user) {
			return res.status(401).json({ status: 401, message: "No user" });
		}

		if (user.role === "user") {
			return res.status(401).json({ status: 401, message: "Unauthorized" });
		}

		req.user = user;

		next();
	} catch (err) {
		return res.status(401).json({ message: "Error Authenticating" });
	}
};

export default adminAuth;
