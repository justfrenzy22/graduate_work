import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import {
	ChangeRoleAdmin,
	DeleteOneAdmin,
	FindAll,
} from "../App/handleFunctions";
import toast from "react-hot-toast";

const Admin = () => {
	const { defaultLanguage, role, theme, systemTheme, _id } =
		useContext<AppContextTypes>(AppContext);
	const [users, setUsers] = useState<AdminI["users"]>([] as AdminI["users"]);
	const [isLoaded, setLoaded] = useState(false);

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	const [col, setCol] = useState<AdminI["col"]>([] as AdminI["col"]);

	useEffect(() => {
		const func = async () => {
			const response = await FindAll(defaultLanguage);

			if (response.status === 200) {
				setUsers(response.users);
				setCol(response.col);
				toast.success(`${response.message}`, {
					style: {
						background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
						borderRadius: "30px",
						color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
					},
					iconTheme: {
						primary: `#452fde`,
						secondary: `#fff`,
					},
				});
			} else {
				toast.success(`${response.message}`, {
					style: {
						background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
						borderRadius: "30px",
						color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
					},
					iconTheme: {
						primary: `#452fde`,
						secondary: `#fff`,
					},
				});
			}
			setLoaded(true);
		};
		func();
	}, []);
	console.clear();
	console.log(`use askamr`, _id);

	return (
		<div className="flex gap-4 w-full">
			{isLoaded && (
				<>
					{role === "super-admin" ? (
						<SuperAdmin col={col} users={users} />
					) : (
						<AdminComp col={col} users={users} />
					)}
				</>
			)}
		</div>
	);
};

export default Admin;

const SuperAdmin: React.FC<AdminI> = ({ col, users }) => {
	const { defaultLanguage, theme, systemTheme } =
		useContext<AppContextTypes>(AppContext);

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	const ChangeRole = async (id: string) => {
		console.log(`id`, id);
		const response = await ChangeRoleAdmin(defaultLanguage, id);
		if (response.status === 200) {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
		} else {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
		}
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};

	const Delete = async (id: string) => {
		const response = await DeleteOneAdmin(defaultLanguage, id);
		if (response.status === 200) {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
		} else {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
		}

		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};

	return (
		<Table color="primary" aria-label="Example static collection table">
			<TableHeader>
				{col.map((item: string, idx: number) => (
					<TableColumn key={idx}>{item}</TableColumn>
				))}
			</TableHeader>

			<TableBody>
				{/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
				{users.map((user: User) => (
					<TableRow key={user._id}>
						<TableCell>{user.username}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>
							<div className="flex flex-row gap-2">
								<Button
									onPress={() => ChangeRole(user._id)}
									// onPress={() => console.log(`user._id`, user._id)}
									color="primary"
									variant="shadow"
									radius="full"
								>
									{defaultLanguage === "bg-BG" ? "Редакция" : "Edit"}
								</Button>
								<Button
									onPress={() => Delete(user._id)}
									color="danger"
									variant="shadow"
									radius="full"
								>
									{defaultLanguage === "bg-BG" ? "Изтриване" : "Delete"}
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

const AdminComp: React.FC<AdminI> = ({ col, users }) => {
	const { defaultLanguage, theme, systemTheme } =
		useContext<AppContextTypes>(AppContext);

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	const Delete = async (id: string) => {
		const response = await DeleteOneAdmin(defaultLanguage, id);
		if (response.status === 200) {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
		} else {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
		}

		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};
	return (
		<Table color="primary" aria-label="Example static collection table">
			<TableHeader>
				{col.map((item: string, idx: number) => (
					<TableColumn key={idx}>{item}</TableColumn>
				))}
			</TableHeader>

			<TableBody>
				{/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
				{users.map((user: User) => (
					<TableRow key={user._id}>
						<TableCell>{user.username}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>
							{/* <Button>Edit Role</Button> */}
							<Button
								onPress={() => Delete(user._id)}
								color="primary"
								variant="shadow"
								radius="full"
							>
								{defaultLanguage === "en-US" ? "Delete" : "Изтриване"}
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

interface AdminI {
	col: string[];
	users: Array<User>;
}

type User = {
	_id: string;
	email: string;
	role: string;
	username: string;
};
