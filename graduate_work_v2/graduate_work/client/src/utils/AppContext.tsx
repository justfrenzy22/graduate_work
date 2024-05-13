import React, { createContext, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Load } from "../components/App/onloadFuncs";
import Cookies from "js-cookie";
import { useDisclosure } from "@nextui-org/react";
import { GetScore } from "../components/App/handleFunctions";

export interface AppContextTypes {
	defaultLanguage: `bg-BG` | `en-US`;
	setDefaultLanguage: React.Dispatch<React.SetStateAction<`bg-BG` | `en-US`>>;
	systemTheme: boolean;
	themeStyle: {
		dark: string;
		light: string;
	};
	theme: string | undefined;
	setTheme: (theme: string) => void;
	accessToken: boolean;
	setAccessToken: React.Dispatch<React.SetStateAction<boolean>>;
	_id: string;
	set_Id: React.Dispatch<React.SetStateAction<string>>;
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	role: `user` | `admin` | `super-admin`;
	setRole: React.Dispatch<
		React.SetStateAction<`user` | `admin` | `super-admin`>
	>;
	isPublic: boolean;
	setPublic: React.Dispatch<React.SetStateAction<boolean>>;
	score: number;
	setScore: React.Dispatch<React.SetStateAction<number>>;
	verified: boolean;
	setVerified: React.Dispatch<React.SetStateAction<boolean>>;
	isWatch: boolean;
	setIsWatch: React.Dispatch<React.SetStateAction<boolean>>;
	color: "green" | "blue" | "red" | "yellow" | "purple";
	setColor: React.Dispatch<
		React.SetStateAction<`green` | `blue` | `red` | `yellow` | `purple`>
	>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	searchRef: unknown | null | any;
	isMobile: boolean;
	initLoad: boolean;
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	// setInitLoad: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext<AppContextTypes>(Object.create(null));

const AppProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
	const [defaultLanguage, setDefaultLanguage] = useState<`bg-BG` | `en-US`>(
		"" as `bg-BG` | `en-US`
	);
	const { theme, setTheme } = useTheme();
	const [systemTheme, setSystemTheme] = useState<boolean>(false);
	const [accessToken, setAccessToken] = useState<boolean>(false);
	const [_id, set_Id] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [role, setRole] = useState<AppContextTypes["role"]>(
		"" as AppContextTypes["role"]
	);
	const [isPublic, setPublic] = useState<boolean>(true);
	const [score, setScore] = useState<number>(0);
	const [verified, setVerified] = useState<boolean>(false);
	const [isWatch, setIsWatch] = useState<boolean>(false);
	const [color, setColor] = useState<AppContextTypes["color"]>(
		"" as AppContextTypes["color"]
	);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const searchRef = useRef(null);
	const [initLoad, setInitLoad] = useState<boolean>(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const themeStyle = {
		light: "from-[#fff] to-[#452fde]",
		dark: "from-[#000] to-[#040066]",
		// 020035
	};

	useEffect(() => {
		if (theme === "system") {
			setSystemTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
		}
	}, [theme]);

	useEffect(() => {
		const storedLanguage = localStorage.getItem(
			"language"
		) as AppContextTypes["defaultLanguage"];
		if (storedLanguage === null) {
			const defLanguage: AppContextTypes["defaultLanguage"] =
				navigator.language.includes("bg") ? "bg-BG" : "en-US";
			setDefaultLanguage(defLanguage);
			localStorage.setItem("language", defLanguage);
		} else {
			setDefaultLanguage(storedLanguage);
		}
	}, [defaultLanguage]);

	useEffect(() => {
		setInitLoad(true);
		const userAgent = navigator.userAgent;
		const isAndroid = /Android/.test(userAgent);
		const isIOS = /iPhone|iPad|iPod/.test(userAgent);

		setIsMobile(isAndroid || isIOS);
		const token = Cookies.get("access-token");
		if (token !== "") {
			const wait = async () => {
				const response = await Load(token as string);
				const resp = await GetScore();
				setScore(resp.score);
				console.log(`response`, response);
				if (response?.status === 200) {
					set_Id(response.user._id);
					setEmail(response.user.email);
					setUsername(response.user.username);
					setRole(response.user.role);
					setPublic(response.user.isPublic);
					setVerified(response.user.verified);
					setIsWatch(response.user.isWatch);
					setColor(response.user.color);
					setAccessToken(true);
				} else {
					setAccessToken(false);
				}
			};
			wait();
		} else {
			setAccessToken(false);
		}

		setInitLoad(false);
	}, [accessToken]);

	const value: AppContextTypes = {
		defaultLanguage,
		setDefaultLanguage,
		systemTheme,
		themeStyle,
		theme,
		setTheme,
		accessToken,
		setAccessToken,
		_id,
		set_Id,
		email,
		setEmail,
		username,
		setUsername,
		role,
		setRole,
		isPublic,
		setPublic,
		score,
		setScore,
		verified,
		setVerified,
		isWatch,
		setIsWatch,
		color,
		setColor,
		searchRef,
		isMobile,
		initLoad,
		isOpen,
		onOpen,
		onOpenChange,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
