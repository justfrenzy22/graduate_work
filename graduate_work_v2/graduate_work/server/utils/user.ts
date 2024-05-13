import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import env from "../config/env";
import Env from "../config/env.interface";
import UserI from "../models/users.interface";
import User from "../models/users";
import { RequestI } from "../middleware/authNext";

export const verifyEmail = (
	email: string,
	username: string,
	verifyToken: string,
	lang: `bg-BG` | `en-US`
) => {
	const { mailerAPI } = env as Env;

	const mailerSend = new MailerSend({
		apiKey: mailerAPI,
	});

	const recipient = [new Recipient(email, username)];

	const sendFrom = new Sender(
		"MS_I0FUbz@trial-k68zxl2exxmlj905.mlsender.net",
		"CrackFlix Support Team"
	);

	const verifyLink = `https://crackflix.site/user/verify/${verifyToken}`;

	const emailParams = new EmailParams()
		.setFrom(sendFrom)
		.setTo(recipient)
		.setReplyTo(sendFrom);

	let subject = "";
	let htmlContent = "";
	let textContent = "";

	if (lang === "bg-BG") {
		subject = "Потвърдете вашия имейл";
		htmlContent = `
            <html>
                <body>
                    <h1>Добре дошли в CrackFlix!</h1>
                    <p>Уважаеми ${username},</p>
                    <p>Ние сме развълнувани, че сте се присъединили към нас. Моля, потвърдете вашия имейл адрес, за да активирате акаунта си.</p>
                    <p>Този имейл е генериран автоматично. Не отговаряйте на него.</p>
                    <p>Вашият линк за потвърждение ще изтече след 1 ден. Моля, кликнете върху линка по-долу, за да потвърдите:</p>
                    <p><a href="${verifyLink}">Потвърдете имейл</a></p>
                    <p>Ако не сте създали акаунт, моля, пренебрегнете този имейл.</p>
                    <p>Поздрави,<br>Екипът на поддръжката на CrackFlix</p>
                </body>
            </html>
        `;
		textContent = `Отговор от потребител ${email}, параметър някакъв текст`;
	} else {
		// Default to English
		subject = "Verify your email";
		htmlContent = `
            <html>
                <body>
                    <h1>Welcome to CrackFlix!</h1>
                    <p>Dear ${username},</p>
                    <p>We are excited to have you on board. Please verify your email address to activate your account.</p>
                    <p>This email is auto-generated. Do not reply to it.</p>
                    <p>Your verification link will expire in 1 day. Please click the link below to verify:</p>
                    <p><a href="${verifyLink}">Verify Email</a></p>
                    <p>If you did not sign up for an account, please ignore this email.</p>
                    <p>Best regards,<br>CrackFlix Support Team</p>
                </body>
            </html>
        `;
		textContent = `Response from User ${email}, parameter some text`;
	}

	emailParams.setSubject(subject).setHtml(htmlContent).setText(textContent);

	mailerSend.email
		.send(emailParams)
		.catch((error) => console.log(`error sending email`, error.body));
};

export const changeEmail = (
	newEmail: string,
	username: string,
	token: string,
	lang: `bg-BG` | `en-US`
) => {
	const { mailerAPI } = env as Env;

	const mailerSend = new MailerSend({
		apiKey: mailerAPI,
	});

	const recipient = [new Recipient(newEmail, username)]; // Send verification link to the new email address

	const sendFrom = new Sender(
		"MS_I0FUbz@trial-k68zxl2exxmlj905.mlsender.net",
		"CrackFlix Support Team"
	);

	const verifyLink = `https://crackflix.site/user/verify-new-email/${token}`; // Include the new email in the verification link

	const emailParams = new EmailParams()
		.setFrom(sendFrom)
		.setTo(recipient)
		.setReplyTo(sendFrom);

	let subject = "";
	let htmlContent = "";
	let textContent = "";

	if (lang === "bg-BG") {
		subject = "Потвърждение на промяната на имейл";
		htmlContent = `
            <html>
                <body>
                    <h1>Промяната на имейл адреса е успешна!</h1>
                    <p>Уважаеми ${username},</p>
                    <p>Бихме искали да ви информираме, че вашата промяна на имейл адреса е успешно потвърдена.</p>
                    <p>Моля, кликнете на линка по-долу, за да потвърдите промяната на имейл адреса си:</p>
                    <p><a href="${verifyLink}">Потвърди нов имейл адрес</a></p>
                    <p>Поздрави,<br>Екипът на поддръжката на CrackFlix</p>
                </body>
            </html>
        `;
		textContent = `Отговор от потребител ${newEmail}, параметър някакъв текст`;
	} else {
		// Default to English
		subject = "Confirmation of Email Change";
		htmlContent = `
            <html>
                <body>
                    <h1>Email address change successful!</h1>
                    <p>Dear ${username},</p>
                    <p>We would like to inform you that your email address change has been successfully confirmed.</p>
                    <p>Please click the link below to confirm your new email address:</p>
                    <p><a href="${verifyLink}">Confirm New Email Address</a></p>
                    <p>Best regards,<br>CrackFlix Support Team</p>
                </body>
            </html>
        `;
		textContent = `Response from User ${newEmail}, parameter some text`;
	}

	emailParams.setSubject(subject).setHtml(htmlContent).setText(textContent);

	mailerSend.email
		.send(emailParams)
		.catch((error) => console.log(`error sending email`, error.body));
};

export const resendVerificationEmail = (
	email: string,
	username: string,
	verifyToken: string,
	lang: `bg-BG` | `en-US`
) => {
	const { mailerAPI } = env as Env;

	const mailerSend = new MailerSend({
		apiKey: mailerAPI,
	});

	const recipient = [new Recipient(email, username)];

	const sendFrom = new Sender(
		"MS_I0FUbz@trial-k68zxl2exxmlj905.mlsender.net",
		"CrackFlix Support Team"
	);

	const verifyLink = `https://crackflix.site/user/verify/${verifyToken}`;

	const emailParams = new EmailParams()
		.setFrom(sendFrom)
		.setTo(recipient)
		.setReplyTo(sendFrom);

	let subject = "";
	let htmlContent = "";
	let textContent = "";

	if (lang === "bg-BG") {
		subject = "Изпрати повторно имейл за потвърждение";
		htmlContent = `
            <html>
                <body>
                    <h1>Изисква се потвърждение за профила Ви на CrackFlix</h1>
                    <p>Уважаеми ${username},</p>
                    <p>Отбелязахме, че все още не сте потвърдили имейл адреса си за вашия акаунт на CrackFlix.</p>
                    <p>За да активирате акаунта си, моля, потвърдете имейл адреса си, като кликнете върху линка по-долу:</p>
                    <p><a href="${verifyLink}">Потвърдете имейл</a></p>
                    <p>Ако не сте създали акаунт, моля, пренебрегнете този имейл.</p>
                    <p>Поздрави,<br>Екипът на поддръжката на CrackFlix</p>
                </body>
            </html>
        `;
		textContent = `Отговор от потребител ${email}, параметър някакъв текст`;
	} else {
		// Default to English
		subject = "Resend Verification Email";
		htmlContent = `
            <html>
                <body>
                    <h1>Verification Required for CrackFlix Account</h1>
                    <p>Dear ${username},</p>
                    <p>We noticed that you haven't verified your email address for your CrackFlix account yet.</p>
                    <p>To activate your account, please verify your email address by clicking the link below:</p>
                    <p><a href="${verifyLink}">Verify Email</a></p>
                    <p>If you did not sign up for an account, please ignore this email.</p>
                    <p>Best regards,<br>CrackFlix Support Team</p>
                </body>
            </html>
        `;
		textContent = `Response from User ${email}, parameter some text`;
	}

	emailParams.setSubject(subject).setHtml(htmlContent).setText(textContent);

	mailerSend.email
		.send(emailParams)
		.catch((error) => console.log(`error sending email`, error.body));
};

export const togglePublicStatus = async (user: RequestUserI) => {
	await User.updateOne(
		{ _id: user._id },
		{ $set: { isPublic: !user.isPublic } }
	);
};

export const toggleIsWatchedStatus = async (user: RequestUserI) => {
	await User.updateOne({ _id: user._id }, { $set: { isWatch: !user.isWatch } });
};

export const addScore = async (
	userId: UserI["_id"],
	mediaId: number,
	media: `movie` | `tv`
) => {
	const user = (await User.findOne({ _id: userId })) as UserI;

	const alreadyWatched = user.watched.some(
		(item) => item.id === mediaId && item.media === media
	);

	if (!alreadyWatched) {
		const scoreToAdd = 5;
		await User.updateOne({ _id: userId }, { $inc: { score: scoreToAdd } });
	}
};

export const addWatched = async (
	user: RequestUserI,
	mediaId: Number,
	media_type: `movie` | `tv`,
	season?: Number,
	episode?: Number
) => {
	if (user.isWatch === false) {
		return;
	}

	const findUser = (await User.findOne({ _id: user._id })) as UserI;

	const exists = findUser.watched.find(
		(item) => item.id === mediaId && item.media === media_type
	);

	if (!exists) {
		if (media_type === "movie") {
			await User.updateOne(
				{ _id: user._id },
				{ $push: { watched: { id: mediaId, media: media_type } } }
			);
		} else if (
			media_type === "tv" &&
			season !== undefined &&
			episode !== undefined
		) {
			await User.updateOne(
				{ _id: user._id },
				{
					$push: {
						watched: { id: mediaId, media: media_type, season, episode },
					},
				}
			);
		}
	} else if (
		media_type === "tv" &&
		exists.media === "tv" &&
		season !== undefined &&
		episode !== undefined
	) {
		if (
			season > exists.season ||
			(season === exists.season && episode > exists.episode)
		) {
			await User.updateOne(
				{ _id: user._id, "watched.id": mediaId, "watched.media": media_type },
				{ $set: { "watched.$.season": season, "watched.$.episode": episode } }
			);
		}

		await User.updateOne(
			{ _id: user._id, "watched.id": mediaId, "watched.media": media_type },
			{ $set: { "watched.$.season": season, "watched.$.episode": episode } }
		);
	}
};



export const statusLiked = async (
	user: RequestUserI,
	mediaId: number,
	media_type: `movie` | `tv`
) => {
	const result = (await User.findOne({
		_id: user._id,
	})) as UserI;

	const liked = result.liked.find(
		(item) => item.id === mediaId && item.media === media_type
	);
	return liked ? true : false;
};

export const toggleLikedProcess = async (
	user: RequestUserI,
	mediaId: number,
	media_type: "movie" | "tv"
) => {
	const userDocument = (await User.findOne({
		_id: user._id,
	})) as UserI;

	let res = false;

	for (let i = 0; i < userDocument.liked.length; i++) {
		if (
			userDocument.liked[i].id === mediaId &&
			userDocument.liked[i].media === media_type
		) {
			res = true;
		}
	}

	if (res) {
		await User.updateOne(
			{ _id: user._id },
			{ $pull: { liked: { id: mediaId, media: media_type } } }
		);
	} else {
		await User.updateOne(
			{ _id: user._id },
			{ $push: { liked: { id: mediaId, media: media_type } } }
		);
	}

	return res;
};

export const checkEmail = async (req: RequestI) => {
	const { email } = req.body;
	const { _id } = req.user as RequestUserI;

	const existingUser = await User.findOne({
		email,
		_id: { $ne: _id },
	});

	return !existingUser;
};

export const checkUsername = async (req: RequestI) => {
	const { username } = req.body;
	const { _id } = req.user as RequestUserI;

	const existingUser = await User.findOne({
		username,
		_id: { $ne: _id },
	});

	return !existingUser;
};

export interface RequestUserI {
	_id: UserI["_id"];
	email: UserI["email"];
	username: UserI["username"];
	role: UserI["role"];
	isPublic: UserI["isPublic"];
	score: UserI["score"];
	verified: UserI["verified"];
	isWatch: UserI["isWatch"];
	color: UserI["color"];
}
