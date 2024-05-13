import { useContext, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { Button, Link, Switch, Tooltip } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {
	DeleteOne,
	ToggleIsPublic,
	ToggleIsWatched,
} from "../App/handleFunctions";
import toast from "react-hot-toast";
import { Load } from "../App/onloadFuncs";

const Settings = () => {
	const { defaultLanguage, verified, isPublic, isWatch, theme, systemTheme } =
		useContext<AppContextTypes>(AppContext);
	const [isPrivateSelected, setIsPrivateSelected] =
		useState<boolean>(!isPublic);
	const [isWatchSelected, setIsWatchSelected] = useState<boolean>(isWatch);

	return (
		<div className=" flex gap-3 sm:gap-[20px]  px-[10px] sm:px-[60px]  items-center justify-center">
			{verified
				? Verified(
						defaultLanguage,
						isPrivateSelected,
						setIsPrivateSelected,
						isWatchSelected,
						setIsWatchSelected,
						theme,
						systemTheme
					)
				: NoVerifiedComp(defaultLanguage)}
		</div>
	);
};

export default Settings;
const Verified = (
	defaultLanguage: AppContextTypes["defaultLanguage"],
	isPrivateSelected: boolean,
	setIsPrivateSelected: React.Dispatch<React.SetStateAction<boolean>>,
	isWatchSelected: boolean,
	setIsWatchSelected: React.Dispatch<React.SetStateAction<boolean>>,
	theme: AppContextTypes["theme"],
	systemTheme: AppContextTypes["systemTheme"]
) => {
	const {
		setAccessToken,
		set_Id,
		setEmail,
		setUsername,
		setRole,
		setPublic,
		setScore,
		setVerified,
		setIsWatch,
		setColor,
	} = useContext<AppContextTypes>(AppContext);

	const navigate = useNavigate();

	const [isOpen, setOpen] = useState<boolean>(false);
	const handlePublicToggle = async () => {
		const themeKey: AppContextTypes["theme"] =
			theme === "system" ? (systemTheme ? "dark" : "light") : theme;

		const resp = await ToggleIsPublic(defaultLanguage);
		if (resp.status === 200) {
			setIsPrivateSelected(!isPrivateSelected);
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
		} else {
			setIsPrivateSelected(isPrivateSelected);
		}
	};

	const handleIsWatchedToggle = async () => {
		const themeKey: AppContextTypes["theme"] =
			theme === "system" ? (systemTheme ? "dark" : "light") : theme;

		const resp = await ToggleIsWatched(defaultLanguage);
		if (resp.status === 200) {
			setIsWatchSelected(!isWatchSelected);
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
		} else {
			setIsWatchSelected(isWatchSelected);
		}
	};

	const handleDeleteProfile = async () => {
		const themeKey: AppContextTypes["theme"] =
			theme === "system" ? (systemTheme ? "dark" : "light") : theme;

		const resp = await DeleteOne(defaultLanguage);
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
			setAccessToken(false);
			setTimeout(async () => {
				navigate("/");
			}, 2000);
		} else {
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
		}
	};

	return (
		<div>
			<div className="flex flex-col sm:w-[800px] w-[95vw] items-center p-8 gap-[30px] sm:bg-background/40 bg-background/40 dark:bg-default/40 rounded-xl">
				<h1 className="mb-2 text-3xl tracking-tight font-bold p-4">
					{defaultLanguage === "bg-BG" ? "Настройки" : "Settings"}
				</h1>
				<div className="flex flex-row justify-between w-full ">
					<div>
						<p className="text-default-600">
							{defaultLanguage === "en-US" ? `Private Profile` : `Таен Профил`}
						</p>
						<p className="text-default-400 text-sm w-[60%]">
							{defaultLanguage === "en-US"
								? `Activating a private profile will limit who can see your profile details.`
								: `Активирането на таен профил ще ограничи кой може да вижда детайлите на вашия профил.`}
						</p>
					</div>
					<Switch
						isSelected={isPrivateSelected}
						onValueChange={handlePublicToggle}
						aria-label="Private Profile"
					/>
				</div>
				<div className="flex flex-row justify-between w-full">
					<div>
						<p className="text-default-600">
							{defaultLanguage === "en-US"
								? `Watch History`
								: `История на гледането`}
						</p>
						<p className="text-default-400 text-sm w-[60%]">
							{defaultLanguage === "en-US"
								? `Enabling watch history will keep track of the movies and shows you've watched.`
								: `Активирането на историята на гледането ще проследява филмите и сериалите, които сте гледали.`}
						</p>
					</div>
					<Switch
						isSelected={isWatchSelected}
						onValueChange={handleIsWatchedToggle}
						aria-label="Private Profile"
					/>
				</div>
				<Tooltip
					isOpen={isOpen}
					content={
						<div className="flex flex-col w-full gap-1 p-1 justify-center items-center">
							<p className="text-xl font-bold">
								{defaultLanguage === "en-US"
									? "Delete your Profile"
									: "Изтрий Профила си"}
							</p>
							<p className="w-[60%] text-center">
								{defaultLanguage === "en-US"
									? "Are you sure? If you delete your profile, it and all of your data, will be permanently deleted."
									: " Сигурни ли сте? Ако изтриете вашия профил, той и всички ваши данни, ще бъдат изтрити. "}
							</p>
							<div className="flex flex-row justify-center gap-4">
								<Button
									onClick={() => setOpen(false)}
									color="primary"
									variant="shadow"
									// className="max-w-[100px]"
									radius="full"
								>
									{defaultLanguage === "en-US" ? "Close" : "Затвори"}
								</Button>
								<Button
									color="danger"
									radius="full"
									variant="faded"
									onClick={handleDeleteProfile}
								>
									{defaultLanguage === "en-US"
										? "Yes, Delete It"
										: "Да, изтрий го"}
								</Button>
							</div>
						</div>
					}
				>
					<Button
						onClick={() => setOpen(true)}
						// color="primary"
						radius="full"
						color="danger"
						variant="shadow"
						className="max-w-[150px] flex jsutify-end text-end"
					>
						{defaultLanguage === "en-US" ? "Delete Profile" : "Изтрий профила"}
					</Button>
				</Tooltip>
			</div>
		</div>
	);
};

export const NoVerifiedComp = (defaultLanguage: string) => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col justify-center items-center mt-4">
			<h1 className="text-3xl font-bold">
				{defaultLanguage === "en-US"
					? `Your profile is not verified`
					: `Вашият профил не е потвърден`}
			</h1>
			<p>
				{defaultLanguage === "en-US"
					? `To verify it click`
					: `За да го потвърдите, цъкнете`}{" "}
				<Link
					className="cursor-pointer"
					onPress={() => navigate("/user/profile")}
				>
					{defaultLanguage === "en-US" ? `Here` : `Тук`}{" "}
					{defaultLanguage === "en-US" && `it`}
				</Link>
			</p>
		</div>
	);
};
