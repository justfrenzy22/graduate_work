import { Response } from 'express';
import UserI from '../models/users.interface';
import { RequestUserI } from '../utils/user';

const serverError = (res: Response, err: Error, lang: string) => {
	console.error(err);
	if (lang === 'bg-BG') {
		return res
			.status(500)
			.json({ status: 500, message: 'Възникна грешка', type: 'server' });
	} else {
		return res
			.status(500)
			.json({
				status: 500,
				message: 'Internal server error',
				type: 'server',
			});
	}
};

const sendUnauthorized = (res: Response, lang: string) => {
	if (lang === 'bg-BG') {
		return res
			.status(401)
			.json({
				status: 401,
				message: 'Невалидно потребителско име или парола',
				type: ['server', 'username', 'password'],
			});
	} else {
		return res
			.status(401)
			.json({ status: 401, message: 'Invalid username or password', 
			type: ['username', 'password'] });
	}
	// res.status(401).json({ status :401, message });
};

const sendRegisterConflict = (res: Response, lang: string, type: string) => {
	if (type === 'email') {
		if (lang === 'bg-BG') {
			return res
				.status(409)
				.json({
					status: 409,
					message: 'Имейлът вече съществува',
					type: 'email',
				});
		} else {
			return res
				.status(409)
				.json({
					status: 409,
					message: 'Email already exists',
					type: 'email',
				});
		}
	} else {
		if (lang === 'bg-BG') {
			return res
				.status(409)
				.json({
					status: 409,
					message: 'Потребителското име вече съществува',
					type: 'username',
				});
		} else {
			return res
				.status(409)
				.json({
					status: 409,
					message: 'Username already exists',
					type: 'username',
				});
		}
	}
};

const loginSuccess = (res: Response, lang: string, user: RequestUserI) => {
	if (lang === 'bg-BG') {
		return res
			.status(200)
			.json({ status: 200, message: 'Потребителят влезе успешно!', user: user });
	} else {
		return res
			.status(200)
			.json({ status: 200, message: 'User logged in successfully!', user: user });
	}
};

const registerSuccess = (res: Response, lang: string) => {
	if (lang === 'bg-BG') {
		return res
			.status(200)
			.json({ status: 200, message: 'Потребителят е създаден успешно!' });
	} else {
		return res
			.status(200)
			.json({ status: 200, message: 'User created successfully!' });
	}
}

const usersDeleted = (res: Response) => {
	return res
		.status(200)
		.json({
			status: 200,
			message: 'All users have been successfully deleted.',
		});
};

const sendCreated = (
	res: Response,
	message: string,
	headers?: Record<string, string>
) => {
	res.status(200).json({ status: 200, message });
};

export default {
	serverError,
	sendUnauthorized,
	sendRegisterConflict,
	loginSuccess,
	registerSuccess,
	usersDeleted,
	sendCreated,
};
