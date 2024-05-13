import jwt, { decode } from "jsonwebtoken";
import User from "../models/users";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import env from "../config/env";
import Env from "../config/env.interface";
import handle from "../view/users";
import {
	RequestUserI,
	changeEmail,
	checkEmail,
	checkUsername,
	resendVerificationEmail,
	toggleIsWatchedStatus,
	toggleLikedProcess,
	togglePublicStatus,
	verifyEmail,
} from "../utils/user";
import UserI from "../models/users.interface";
import { RequestI } from "../middleware/authNext";
import Movie from "../models/movie";
import TVI from "../models/tv.interface";
import MovieI from "../models/movie.interface";
import TV from "../models/tv";

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
		})) as UserI | null;

		if (!findUser || !bcrypt.compareSync(password, findUser.password)) {
			return handle.sendUnauthorized(res, lang);
		}

		const user = {
			_id: findUser._id,
			email: findUser.email,
			username: findUser.username,
			role: findUser.role,
			isPublic: findUser.isPublic,
			verified: findUser.verified,
			isWatch: findUser.isWatch,
			color: findUser.color,
		} as RequestUserI;

		const accessToken: string = jwt.sign(
			{ user: user },
			env.JWT_SECRET_KEY as Env["JWT_SECRET_KEY"],
			{ expiresIn: "1d" }
		);

		res.header("access-token", `Bearer ${accessToken}`);

		res.header("Access-Control-Expose-Headers", "access-token");

		return handle.loginSuccess(res, lang, user);
	} catch (err: any) {
		return handle.serverError(res, err, lang);
	}
};

const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body as UserI;
	const { lang } = req.query as unknown as QueryParams;
	const { JWT_SECRET_KEY } = env as Env;

	try {
		const user: UserI | null = await User.findOne({ username }).lean().exec();

		if (user) {
			return handle.sendRegisterConflict(res, lang, "username");
		}

		const emailExists: UserI | null = await User.findOne({ email })
			.lean()
			.exec();
		if (emailExists) {
			return handle.sendRegisterConflict(res, lang, "email");
		}

		const hashedPassword = bcrypt.hashSync(password, 10);

		const colors = [
			"green",
			"blue",
			"red",
			"yellow",
			"purple",
		] as UserI["color"][];
		const randomColor = colors[
			Math.floor(Math.random() * colors.length)
		] as UserI["color"];

		const newUser: UserI = new User({
			username,
			email,
			password: hashedPassword,
			role: email === "just.frenzy22@gmail.com" ? "super-admin" : "user",
			verified: false,
			color: randomColor,
		}) as UserI;
		await newUser.save();

		const verifyToken = jwt.sign({ email }, JWT_SECRET_KEY, {
			expiresIn: "1d",
		});

		verifyEmail(newUser.email, newUser.username, verifyToken, lang);

		return handle.registerSuccess(res, lang);
	} catch (err: Error | any) {
		return handle.serverError(res, err, lang);
	}
};

const load = (req: RequestI, res: Response) => {
	const user = {
		_id: req.user?._id,
		email: req.user?.email,
		username: req.user?.username,
		role: req.user?.role,
		isPublic: req.user?.isPublic,
		verified: req.user?.verified,
		isWatch: req.user?.isWatch,
		color: req.user?.color,
	} as RequestUserI;

	return res.status(200).json({
		status: 200,
		message: "User loaded successfully",
		user: user,
	});
};

const verify = async (req: RequestI, res: Response) => {
	const { token, lang } = req.query as unknown as {
		token: string;
		lang: `bg-BG` | `en-US`;
	};
	const { JWT_SECRET_KEY } = env as Env;

	if (!token) {
		return res.status(402).json({ status: 402, message: `Token is required` });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET_KEY) as unknown as UserI;

		const { email } = decoded;

		const user = (await User.findOne({ email })) as UserI | null;

		if (!user) {
			return res.status(404).json({ status: 404, message: `User not found` });
		}

		const newUser = {
			_id: user._id,
			email: user.email,
			username: user.username,
			role: user.role,
			isPublic: user.isPublic,
			verified: user.verified,
			color: user.color,
			isWatch: user.isWatch,
		} as RequestUserI;

		const accessToken: string = jwt.sign(
			{ user: newUser },
			env.JWT_SECRET_KEY as Env["JWT_SECRET_KEY"],
			{ expiresIn: "1d" }
		);
		res.header("access-token", `Bearer ${accessToken}`);
		res.header("Access-Control-Expose-Headers", "access-token");

		if (user.verified) {
			return res.status(400).json({
				status: 400,
				message:
					lang === "bg-BG"
						? `Потребителят вече е валидиран`
						: `User already verified`,
			});
		}

		user.verified = true;
		await user.save();

		return res.status(200).json({
			status: 200,
			message:
				lang === "bg-BG"
					? `Потребителят е валидиран успешно`
					: `User verified successfully`,
		});
	} catch (err) {
		console.error(`paralelepiped`, err);
		return res.status(401).json({
			status: 401,
			message:
				lang === "bg-BG"
					? `Невалиден или изтекъл токен`
					: `Invalid or expired token`,
		});
	}
};

const toggleLiked = async (req: RequestI, res: Response) => {
	const { mediaId, media_type, lang } = req.query as unknown as {
		mediaId: string;
		media_type: "movie" | "tv";
		lang: `bg-BG` | `en-US`;
	};
	const result = await toggleLikedProcess(
		req.user as RequestUserI,
		parseInt(mediaId),
		media_type
	);
	let message;

	if (result) {
		message =
			lang === "bg-BG"
				? "Медията е премахната от харесвани."
				: "Media removed from liked";
	} else {
		message =
			lang === "bg-BG"
				? "Медията е добавена към харесвани."
				: "Media added to liked";
	}

	return res.status(200).json({ status: 200, message: message });
};

const deleteOne = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US` };

	await User.findOneAndDelete({ _id: req.user?._id });
	return res.status(200).json({
		status: 200,
		message:
			lang === "en-US"
				? "User deleted successfully"
				: "Потребителят е изтрит успешно",
	});
};

const getLiked = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US`; page: string };

	const findUser = (await User.findOne({ _id: req.user?._id })) as UserI;

	if (findUser.liked.length === 0) {
		return res.status(200).json({
			status: 200,
			media: [],
			message:
				lang === "bg-BG"
					? "Няма харесвания. Харесайте нещо за да го видите тук"
					: "No liked media. Like some to see them here",
		});
	}

	let arr: any = [];
	for (let i = 0; i < findUser.liked.length; i++) {
		if (findUser.liked[i].media === "movie") {
			const find = await Movie.findOne({
				id: findUser.liked[i].id,
				lang: lang,
			});
			if (find) {
				// Check if find is not null
				let something = {
					...find.toObject(), // Convert Mongoose document to a plain object
					media_type: findUser.liked[i].media, // Add the media_type field
				};
				arr.push(something);
			}
		} else {
			const find = await TV.findOne({
				id: findUser.liked[i].id,
				lang: lang,
			});
			if (find) {
				// Check if find is not null
				let something = {
					...find.toObject(), // Convert Mongoose document to a plain object
					media_type: findUser.liked[i].media, // Add the media_type field
				};
				arr.push(something);
			}
		}
	}

	return res.status(200).json({
		status: 200,
		media: arr,
		message: lang === "bg-BG" ? "Харесвани" : "Liked",
	});
};

const getWatched = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US`; page: string };

	const findUser = (await User.findOne({ _id: req.user?._id })) as UserI;

	if (findUser.watched.length === 0) {
		return res.status(200).json({
			status: 200,
			media: [],
			message:
				lang === "bg-BG"
					? "Няма гледания. Гледайте нещо за да го видите тук"
					: "No watched media. Watch some to see them here",
		});
	}

	let arr: any = [];
	for (let i = 0; i < findUser.watched.length; i++) {
		if (findUser.watched[i].media === "movie") {
			const find = await Movie.findOne({
				id: findUser.watched[i].id,
				lang: lang,
			});
			if (find) {
				// Check if find is not null
				let something = {
					...find.toObject(), // Convert Mongoose document to a plain object
					media_type: findUser.watched[i].media, // Add the media_type field
				};
				arr.push(something);
			}
		} else {
			const find = await TV.findOne({
				id: findUser.watched[i].id,
				lang: lang,
			});
			if (find) {
				// Check if find is not null
				let something = {
					...find.toObject(), // Convert Mongoose document to a plain object
					media_type: findUser.watched[i].media, // Add the media_type field
				};
				arr.push(something);
			}
		}
	}

	return res.status(200).json({
		status: 200,
		media: arr,
		message: lang === "bg-BG" ? "Харесвани" : "watched",
	});
};

const changeRole = async (req: RequestI, res: Response) => {
	const { role, id } = req.query as unknown as {
		role: UserI["role"];
		id: UserI["_id"];
	};

	const user = await User.findOne({ _id: id });
	if (!user) {
		return res.status(404).json({ status: 404, message: `User not found` });
	}
	user.role = role;
	await user.save();
	return res.status(200).json({ status: 200, message: `User role changed` });
};

const getScore = async (req: RequestI, res: Response) => {
	const { _id } = req.user as RequestUserI;

	const findUser = await User.findOne({ _id });

	return res.status(200).json({ status: 200, score: findUser?.score });
};

const toggleIsWatched = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US` };

	await toggleIsWatchedStatus(req.user as RequestUserI);

	const findUser = (await User.findOne({ _id: req.user?._id })) as UserI;

	const newUser = {
		_id: findUser._id,
		email: findUser.email,
		username: findUser.username,
		role: findUser.role,
		isPublic: findUser.isPublic,
		verified: findUser.verified,
		color: findUser.color,
		isWatch: findUser.isWatch,
	} as RequestUserI;

	const accessToken: string = jwt.sign(
		{ user: newUser },
		env.JWT_SECRET_KEY as Env["JWT_SECRET_KEY"],
		{ expiresIn: "1d" }
	);
	// Assuming changeEmail is a function to handle email change confirmation

	res.header("access-token", `Bearer ${accessToken}`);
	res.header("Access-Control-Expose-Headers", "access-token");

	return res.status(200).json({
		status: 200,
		message:
			lang === "en-US"
				? "Watching Status is updated"
				: "Статуса на гледане е обновен",
		accessToken: `Bearer ${accessToken}`,
	});
};

const toggleIsPublic = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US` };

	await togglePublicStatus(req.user as RequestUserI);

	const findUser = (await User.findOne({ _id: req.user?._id })) as UserI;

	const newUser = {
		_id: findUser._id,
		email: findUser.email,
		username: findUser.username,
		role: findUser.role,
		isPublic: findUser.isPublic,
		verified: findUser.verified,
		color: findUser.color,
		isWatch: findUser.isWatch,
	} as RequestUserI;

	const accessToken: string = jwt.sign(
		{ user: newUser },
		env.JWT_SECRET_KEY as Env["JWT_SECRET_KEY"],
		{ expiresIn: "1d" }
	);
	// Assuming changeEmail is a function to handle email change confirmation

	res.header("access-token", `Bearer ${accessToken}`);
	res.header("Access-Control-Expose-Headers", "access-token");

	return res.status(200).json({
		status: 200,
		message:
			lang === "en-US"
				? "Profile status is updated"
				: "Статуса на профила е обновен",
		accessToken: `Bearer ${accessToken}`,
	});
};

const resendVerifyEmail = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US` };

	const { JWT_SECRET_KEY } = env as Env;

	const email = req.user?.email;

	const verifyToken = jwt.sign({ email }, JWT_SECRET_KEY, {
		expiresIn: "1d",
	});

	verifyEmail(
		req.user?.email as string,
		req.user?.username as string,
		verifyToken,
		lang
	);
	resendVerificationEmail(
		req.user?.email as string,
		req.user?.username as string,
		verifyToken as string,
		lang as `bg-BG` | `en-US`
	);

	return res.status(200).json({
		status: 200,
		message:
			lang === "bg-BG"
				? `Валидиращият имейл беше изпратен`
				: `Verification email sent`,
	});
};

const update = async (req: RequestI, res: Response) => {
	const { _id } = req.user as UserI;

	const { lang } = req.query as {
		lang: `bg-BG` | `en-US`;
	};
	const user = await User.findOne({ _id });
	if (!user) {
		return res.status(404).json({ status: 404, message: `User not found` });
	}

	if (!(await checkUsername(req))) {
		return res.status(400).json({
			status: 400,
			message:
				lang === "bg-BG"
					? `Потребителското име вече се използва. Моля изберете друго`
					: `Username alerady exists. Try another one`,
		});
	}

	if (!(await checkEmail(req))) {
		return res.status(400).json({
			status: 400,
			message:
				lang === "bg-BG"
					? `Имейлът вече се използва. Моля изберете друг`
					: `Email already exists. Try another one`,
		});
	}

	if (req.body.password) {
		user.password = bcrypt.hashSync(req.body.password, 10);
	}
	user.email = req.body.email;
	user.username = req.body.username;

	await user.save(); // Save the changes to the user document

	const { JWT_SECRET_KEY } = env as Env;
	const email = req.user?.email;
	const verifyToken = jwt.sign({ email }, JWT_SECRET_KEY, {
		expiresIn: "1d",
	});
	let isEmail = false;
	if (req.user?.email !== req.body.email) {
		changeEmail(user.email, user.username, verifyToken, lang);
		isEmail = true;
		user.verified = false;
	}

	const newUser = {
		_id: user._id,
		email: user.email,
		username: user.username,
		role: user.role,
		isPublic: user.isPublic,
		verified: user.verified,
		color: user.color,
		isWatch: user.isWatch,
	} as RequestUserI;

	const accessToken: string = jwt.sign(
		{ user: newUser },
		env.JWT_SECRET_KEY as Env["JWT_SECRET_KEY"],
		{ expiresIn: "1d" }
	);
	// Assuming changeEmail is a function to handle email change confirmation

	res.header("access-token", `Bearer ${accessToken}`);
	res.header("Access-Control-Expose-Headers", "access-token");

	return res.status(200).json({
		status: 200,
		message:
			lang === "en-US"
				? `User profile has been updated successfully`
				: `Вашият профил е обновен успешно`,
		isEmail,
		accessToken: !isEmail && `Bearer ${accessToken}`,
	});
	// }
};

const deleteWatched = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US` };
	await User.updateOne(
		{ _id: req.user?._id },
		{ $set: { watched: [], score: 0 } }
	);
	return res.status(200).json({
		status: 200,
		message: lang === "bg-BG" ? "Гледаните са изтрити" : "Watched deleted",
	});
};

const accountFinder = async (req: Request, res: Response) => {
	console.log(`deeba mamamu`);
	const { username, lang } = req.query as {
		username: string;
		lang: `bg-BG` | `en-US`;
	};

	const findUser = await User.findOne({ username });

	if (!findUser) {
		return res.status(404).json({
			status: 404,
			message:
				lang === "en-US" ? "User not found" : "Потребителят не е намерен",
		});
	} else {
		if (findUser.isPublic) {
			return res.status(200).json({
				status: 200,
				message:
					lang === "en-US" ? "User info: " : "Информация за потребителя: ",
				user: {
					username: findUser.username,
					email: findUser.email,
					color: findUser.color,
					isPublic: findUser.isPublic,
					score: findUser.score,
					role: findUser.role,
				},
			});
		} else {
			return res.status(200).json({
				status: 200,
				message: lang === "en-US" ? "User is private" : "Потребителят е личен",
				user: {
					username: findUser.username,
					color: findUser.color,
					isPublic: findUser.isPublic,
					role: findUser.role,
				},
			});
		}
	}
};

const deleteLiked = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US` };
	await User.updateOne({ _id: req.user?._id }, { $set: { liked: [] } });
	return res.status(200).json({
		status: 200,
		message: lang === "bg-BG" ? "Харесаните са изтрити" : "Liked deleted",
	});
};

const findAll = async (req: RequestI, res: Response) => {
	const { lang } = req.query as { lang: `bg-BG` | `en-US` };
	const users = await User.find({});

	const results = [];

	for (let i = 0; i < users.length; i++) {
		if (req.user?.role === "admin") {
			results.push({
				_id: users[i]._id,
				username: users[i].username,
				email: users[i].email,
			});
		} else {
			results.push({
				_id: users[i]._id,
				username: users[i].username,
				email: users[i].email,
				role: users[i].role,
			});
		}
	}

	return res.status(200).json({
		status: 200,
		message: lang === "bg-BG" ? "Потребители" : "Users",
		users: results,
		col:
			req.user?.role === "admin"
				? [
						lang === "en-US" ? "username" : "потребител",
						lang === "en-US" ? "email" : "имейл",
						lang === "en-US" ? "role" : "роля",
				  ]
				: [
						lang === "en-US" ? "username" : "потребител",
						lang === "en-US" ? "email" : "имейл",
						lang === "en-US" ? "role" : "роля",
						lang === "en-US" ? "delete" : "изтриване",
				  ],
	});
};

const deleteOneAdmin = async (req: RequestI, res: Response) => {
	const { id, lang } = req.query as { id: string; lang: `bg-BG` | `en-US` };
	if (
		// req.user?.role !== "super-admin" &&
		(req.user?._id as unknown as string) !== id
	) {
		const findUser = (await User.findOne({ _id: id })) as UserI;

		if (findUser.role !== "super-admin") {
			await User.deleteOne({ _id: id });
		} else {
			return res.status(403).json({
				status: 403,
				message: lang === "en-US" ? "Forbidden" : "Забранено",
			});
		}
	}
	return res.status(200).json({
		status: 200,
		message: lang === "en-US" ? "User deleted" : "Потребителят е изтрит",
	});
};

const changeRoleAdmin = async (req: RequestI, res: Response) => {
	const { id, lang } = req.query as { id: string; lang: `bg-BG` | `en-US` };
	console.log(`id`, id);
	const findUsr = (await User.findOne({ _id: id })) as UserI;

	if (!findUsr) {
		return res.status(404).json({
			status: 404,
			message:
				lang === "en-US" ? "User not found" : "Потребителят не е намерен",
		});
	}

	if (findUsr.role === "admin") {
		await User.updateOne({ _id: id }, { $set: { role: "user" } });
		return res.status(200).json({
			status: 200,
			message:
				lang === "en-US" ? "User role changed" : "Потребителят е променен",
		});
	} else if (findUsr.role === "user") {
		await User.updateOne({ _id: id }, { $set: { role: "admin" } });
		return res.status(200).json({
			status: 200,
			message:
				lang === "en-US" ? "User role changed" : "Потребителят е променен",
		});
	} else {
		return res.status(405).json({
			status: 405,
			message:
				lang === "en-US"
					? "You can't change user role"
					: "Не можете да променяте ролята на потребителя",
		});
	}
};

const deleteAll = (req: Request, res: Response) => {
	User.deleteMany({});
	return handle.usersDeleted(res);
};

const logout = (req: Request, res: Response) => {
	res.clearCookie("access-token");
	return res.status(200).json({ message: `Logout successful` });
};

export default {
	login,
	logout,
	register,
	load,
	changeRole,
	verify,
	getScore,
	getLiked,
	changeRoleAdmin,
	getWatched,
	toggleIsWatched,
	toggleIsPublic,
	resendVerifyEmail,
	toggleLiked,
	findAll,
	deleteOneAdmin,
	update,
	deleteLiked,
	deleteWatched,
	deleteAll,
	deleteOne,
	accountFinder,
};
