import { useContext, useMemo, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import {
	Accordion,
	AccordionItem,
	Button,
	Input,
	Link,
} from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { ResendVerifyEmail, UpdateProfile } from "../App/handleFunctions";
import toast from "react-hot-toast";
import { Load } from "../App/onloadFuncs";

const Profile = () => {
	const {
		defaultLanguage,
		username,
		email,
		setAccessToken,
		set_Id,
		setEmail,
		setUsername,
		setRole,
		setPublic,
		setScore,
		verified,
		setVerified,
		setIsWatch,
		setColor,
		theme,
		systemTheme,
	} = useContext<AppContextTypes>(AppContext);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<{
		username: AppContextTypes["username"];
		email: AppContextTypes["email"];
		password: string;
		confPassword: string;
	}>({
		username: username,
		email: email,
		password: "",
		confPassword: "",
	});

	const isUsrInvalid = useMemo(() => {
		// if (data.username === "") return false;
		return /^[^\s]+$/i.test(data.username) && data.username.length >= 3
			? false
			: true;
	}, [data.username]);

	const isEmlInvalid = useMemo(() => {
		// if (data.email === "") return false;
		return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)
			? false
			: true;
	}, [data.email]);

	const isPswInvalid = useMemo(() => {
		if (data.password === "") return false;
		return /^[^\s]+$/i.test(data.password) && data.password.length >= 5
			? false
			: true;
	}, [data.password]);

	const isCnfPswInvalid = useMemo(() => {
		if (data.confPassword === "") return false;

		return data.confPassword === data.password ? false : true;
	}, [data.confPassword, data.password]);

	const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
	const [isConfirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>(false);
	const [isClicked, setClicked] = useState<boolean>(false);

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	const handleClick = async () => {
		// e.preventDefault();

		const response = await ResendVerifyEmail(defaultLanguage);

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
		setClicked(true);

		// setClicked(!isClicked);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();

		const resp = await UpdateProfile(data, defaultLanguage);

		if (resp.status === 200) {
			toast.success(`${resp.message}`, {
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
			if (resp.isEmail) {
				setAccessToken(false);
			} else {
				setAccessToken(true);
				setTimeout(async () => {
					const response = await Load(resp.accessToken as string);
					if (response?.status === 200) {
						set_Id(response.user._id);
						setEmail(response.user.email);
						setUsername(response.user.username);
						setRole(response.user.role);
						setPublic(response.user.isPublic);
						setScore(response.user.score);
						setVerified(response.user.verified);
						setIsWatch(response.user.isWatch);
						setColor(response.user.color);
						setAccessToken(true);
					} else {
						setAccessToken(false);
					}
				}, 2000);
			}
		} else {
			toast.error(resp.message);
		}

		setLoading(false);
	};

	return (
		<div className=" flex gap-3 sm:gap-[20px]  px-[10px] sm:px-[60px]  items-center justify-center">
			{verified
				? Verified(
						defaultLanguage,
						isLoading,
						data,
						isUsrInvalid,
						setData,
						isEmlInvalid,
						isPasswordVisible,
						isPswInvalid,
						setPasswordVisible,
						isConfirmPasswordVisible,
						isCnfPswInvalid,
						setConfirmPasswordVisible,
						handleSubmit
					)
				: NoVerifiedComp(defaultLanguage, isClicked, handleClick)}
		</div>
	);
};

export default Profile;
const Verified = (
	defaultLanguage: string,
	isLoading: boolean,
	data: {
		username: AppContextTypes["username"];
		email: AppContextTypes["email"];
		password: string;
		confPassword: string;
	},
	isUsrInvalid: boolean,
	setData: React.Dispatch<
		React.SetStateAction<{
			username: AppContextTypes["username"];
			email: AppContextTypes["email"];
			password: string;
			confPassword: string;
		}>
	>,
	isEmlInvalid: boolean,
	isPasswordVisible: boolean,
	isPswInvalid: boolean,
	setPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>,
	isConfirmPasswordVisible: boolean,
	isCnfPswInvalid: boolean,
	setConfirmPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>,
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
) => {
	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-col sm:w-[800px] items-start w-[95vw] items-center p-4 gap-[30px] sm:bg-background/40 bg-background/40 dark:bg-default/40 rounded-xl ">
				<h1 className="mb-2 text-3xl tracking-tight font-bold p-4">
					{defaultLanguage === "bg-BG" ? "Профил" : "Profile"}
				</h1>
				<Input
					isClearable
					isDisabled={isLoading}
					isReadOnly={isLoading}
					isRequired
					type="text"
					variant="bordered"
					// className=""
					size="lg"
					label={defaultLanguage === "bg-BG" ? "Потребителско име" : "Username"}
					value={data.username}
					isInvalid={isUsrInvalid}
					onClear={() =>
						setData({
							...data,
							username: "",
						})
					}
					onChange={(e) =>
						setData({
							...data,
							username: e.target.value,
						})
					}
				/>
				<Input
					isClearable
					isDisabled={isLoading}
					isReadOnly={isLoading}
					isRequired
					type="email"
					variant="bordered"
					// className=""
					size="lg"
					label={defaultLanguage === "bg-BG" ? "Имейл" : "Email"}
					value={data.email}
					isInvalid={isUsrInvalid}
					onClear={() => setData({ ...data, email: "" })}
					onChange={(e) => setData({ ...data, email: e.target.value })}
					errorMessage={
						isEmlInvalid
							? defaultLanguage === "en-US"
								? "Invalid Email Format"
								: "Невалиден имейл формат"
							: undefined
					}
				/>
				<Accordion>
					<AccordionItem
						key={"password"}
						title={
							defaultLanguage === "bg-BG" ? "Смени Парола" : "Change Password"
						}
					>
						<Input
							// isRequired
							isDisabled={isLoading}
							isReadOnly={isLoading}
							type={isPasswordVisible ? "text" : "password"}
							variant="bordered"
							size="lg"
							label={
								defaultLanguage === "bg-BG" ? "Нова Парола" : "New Password"
							}
							value={data.password}
							isInvalid={isPswInvalid}
							onChange={(e) =>
								setData({
									...data,
									password: e.target.value,
								})
							}
							className="mb-4 select-none text-white"
							// description={
							// 	!isPswInvalid ? descriptionPwd : undefined
							// }
							// errorMessage={
							// 	error && errData.pwd ? isPswInvalid  : undefined
							// }
							endContent={
								<button
									className="focus:outline-none mr-3"
									type="button"
									onClick={() => setPasswordVisible(!isPasswordVisible)}
								>
									{isPasswordVisible ? <EyeOff /> : <Eye />}
								</button>
							}
						/>
						<Input
							// isRequired
							isDisabled={isLoading}
							isReadOnly={isLoading}
							type={isConfirmPasswordVisible ? "text" : "password"}
							variant="bordered"
							size="lg"
							label={
								defaultLanguage === "bg-BG"
									? "Потвърди Новата Парола"
									: "Confirm New Password"
							}
							value={data.confPassword}
							isInvalid={isCnfPswInvalid}
							onChange={(e) =>
								setData({
									...data,
									confPassword: e.target.value,
								})
							}
							isClearable
							className="mb-4 select-none"
							// errorMessage={
							// 	isCnfPswInvalid
							// 		? confirmPasswordErrorMsg
							// 		: undefined
							// }
							endContent={
								<button
									className="focus:outline-none mr-3"
									type="button"
									onClick={() =>
										setConfirmPasswordVisible(!isConfirmPasswordVisible)
									}
								>
									{isConfirmPasswordVisible ? <EyeOff /> : <Eye />}
								</button>
							}
						/>
					</AccordionItem>
				</Accordion>
				<Button
					className="sm:w-[80%] w-full"
					variant="shadow"
					color="primary"
					radius="full"
					type="submit"
				>
					{defaultLanguage === "en-US" ? "Save Changes" : "Запази Промени"}
				</Button>
			</div>
		</form>
	);
};

export const NoVerifiedComp = (
	defaultLanguage: string,
	isClicked: boolean,
	handleClick: () => Promise<void>
) => {
	return (
		<div className="flex flex-col justify-center items-center mt-4">
			<h1 className="text-3xl font-bold">
				{defaultLanguage === "en-US"
					? `Your profile is not verified`
					: `Вашият профил не е потвърден`}
			</h1>
			<p>
				{defaultLanguage === "en-US"
					? `Please verify your email by clicking on the link sent to your email`
					: `Моля, потвърдете своя имейл, като щракнете върху връзката, изпратена на вашия имейл `}
			</p>
			<p>
				{defaultLanguage === "en-US"
					? `If you didn't receive the email, please click to`
					: `Ако нямате получен имейл, моля, щракнете за да го`}{" "}
				<Link
					className="cursor-pointer"
					onPress={!isClicked ? handleClick : undefined}
				>
					{defaultLanguage === "en-US" ? `Verify` : `Потвърдите`}{" "}
					{defaultLanguage === "en-US" && `it`}
				</Link>
			</p>
		</div>
	);
};
