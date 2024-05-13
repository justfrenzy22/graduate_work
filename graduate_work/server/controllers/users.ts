import jwt from "jsonwebtoken";
import User from "../models/users";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserInterface from "../models/users.interface";
import env from "../config/env";
import Env from "../config/env.interface";
import handle from "../view/users";
import { verifyEmail } from "../utils/user";
import UserI from "../models/users.interface";

interface QueryParams {
	lang: `bg-BG` | `en-US`;
}

const login = async (req: Request, res: Response) => {
	const { username, password }: { username: string; password: string } =
		req.body;
	const { lang } = req.query as unknown as QueryParams;
	try {
		const findUser = (await User.findOne({
			$or: [{ username: username }, { email: username }],
		})) as UserInterface | null;

		if (!findUser || !bcrypt.compareSync(password, findUser.password)) {
			return handle.sendUnauthorized(res, lang);
		}

		const accessToken: string = jwt.sign(
			{ user: findUser },
			env.JWT_SECRET_KEY as Env["JWT_SECRET_KEY"],
			{ expiresIn: "1h" }
		);

		res.header("access-token", `Bearer ${accessToken}`);

		res.header("Access-Control-Expose-Headers", "access-token");

		return handle.loginSuccess(res, lang, findUser);
	} catch (err: any) {
		return handle.serverError(res, err, lang);
	}
};

const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body as UserInterface;
	const { lang } = req.query as unknown as QueryParams;
	const { JWT_SECRET_KEY } = env as Env;

	try {
		const user: UserInterface | null = await User.findOne({ username })
			.lean()
			.exec();

		if (user) {
			return handle.sendRegisterConflict(res, lang, "username");
		}

		const emailExists: UserInterface | null = await User.findOne({ email })
			.lean()
			.exec();
		if (emailExists) {
			return handle.sendRegisterConflict(res, lang, "email");
		}

		const hashedPassword = bcrypt.hashSync(password, 10);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			role: email === "just.frenzy22@gmail.com" ? "super-admin" : "user",
			verified: false,
		});
		await newUser.save();

		const verifyToken = jwt.sign({email}, JWT_SECRET_KEY, {expiresIn: '1h'});

		verifyEmail(newUser.email, newUser.username, verifyToken);

		return handle.registerSuccess(res, lang);
	} catch (err: Error | any) {
		return handle.serverError(res, err, lang);
	}
};



interface User {
	username: string;
	email: string;
}
interface AuthenticatedRequest extends Request {
	user?: User;
}

const load = (req: AuthenticatedRequest, res: Response) => {
	return res.status(200).json({
		status: 200,
		message: "User loaded successfully",
		user: { username: req.user?.username, email: req.user?.email },
	});
};

const verify = async (req: Request, res: Response) => {
	const { token } = req.query as unknown as { token: string };
	const { JWT_SECRET_KEY } = env as Env;

	if (!token) {
		return res.status(400).json({ status: 400, message: `Token is required` });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET_KEY) as unknown as UserI;

		const { email } = decoded;

		const user = (await User.findOne({ email })) as UserI | null;

		if (!user) {
			return res.status(404).json({ status: 404, message: `User not found` });
		}

		if (user.verified) {
			return res
				.status(400)
				.json({ status: 400, message: `User already verified` });
		}

		user.verified = true;
		await user.save();

		return res
			.status(200)
			.json({ status: 200, message: `User verified successfully` });
	} catch (err) {
		console.error(err);
		return res
			.status(400)
			.json({ status: 400, message: `Invalid or expired token` });
	}
};

// const toggleWatchList = async (req: AuthenticatedRequest, res: Response) => {
// 	const { email } = req.user as User;
// 	const { id, mediaType } = req.query as unknown as { id: Number, mediaType: 'Movie' | 'TV' };

// 	try {
// 		const findUser = await User.findOne({ email });

// 		const existingItem = findUser?.watchlist.find(item => item.id === Number(id) && item.watchlistModel === mediaType) as any;

// 		if (existingItem) {
// 			findUser?.watchlist.splice(existingItem, 1);
// 			await findUser?.save();
// 			return res.status(200).json({ status: 200, message: 'Item removed from watchlist' });
// 		}

// 		findUser?.watchlist.push({ id, watchlistModel: mediaType });

// 		await findUser?.save();

// 		return res.status(200).json({ status: 200, message: 'Item Added to watchlist' });
// 	} catch (err) {
// 		console.error(err);
// 		return res.status(500).json({ status: 500, message: 'Something went wrong' });
// 	}
// }

// const watchListStatus = async (req: AuthenticatedRequest, res: Response) => {
// 	const { email } = req.user as User;
// 	const { id, mediaType } = req.query as unknown as { id: Number, mediaType: 'Movie' | 'TV' };

// 	try {
// 		const findUser = await User.findOne({ email });

// 		const existingItem = findUser?.watchlist.find(item => item.id === Number(id) && item.watchlistModel === mediaType) as any;

// 		if (existingItem) {
// 			return res.status(200).json({ status: 200, message: 'Item found in watchlist', checked: true });
// 		}
// 		return res.status(200).json({ status: 200, message: 'Item not found in watchlist', checked: false });

// 	} catch (err) {
// 		return res.status(500).json({ status: 500, message: 'Internal Server Error' });
// 	}

// }

const deleteAll = (req: Request, res: Response) => {
	User.deleteMany({});
	return handle.usersDeleted(res);
};

const logout = (req: Request, res: Response) => {
	res.clearCookie("access-token");
	return res.status(200).json({ message: `Logout successful` });
	// return handle.sendSuccess(res, `Logout successful`, '');
};

export default {
	login,
	logout,
	register,
	load,
	verify,
	deleteAll,
	// toggleWatchList,
	// watchListStatus,
};
