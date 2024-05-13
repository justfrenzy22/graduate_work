import {
	Button,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	Progress,
	Tooltip,
	User,
} from "@nextui-org/react";
import { Clock3, Heart, LayoutDashboard, LogOut, Settings } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import Cookies from "js-cookie";
import { NavbarText } from "./NavigationBarText";
import { NavbarTextTypes } from "../App/props.interface";
import { useNavigate } from "react-router-dom";
import { ScoreLogic } from "./ScoreLogic";

type LoggedInViewProps = {
	theme: AppContextTypes["theme"];
	setTheme: AppContextTypes["setTheme"];
	defaultLanguage: AppContextTypes["defaultLanguage"];
	changeLanguage: (lang: AppContextTypes["defaultLanguage"]) => void;
	username: string;
	email: string;
	setAccessToken: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoggedInView: React.FC<LoggedInViewProps> = ({
	theme,
	setTheme,
	defaultLanguage,
	changeLanguage,
	username,
	email,
	setAccessToken,
}) => {
	const { color, accessToken, score } = useContext<AppContextTypes>(AppContext);

	// const { } =

	const {
		profile,
		settings,
		logOut,
		liked,
		watched,
		dark,
		light,
		themeText,
		bg,
		en,
		language,
		system,
	} =
		defaultLanguage === "en-US"
			? (NavbarText.en as NavbarTextTypes)
			: (NavbarText.bg as NavbarTextTypes);

	const [actColor, setActColor] = useState<
		"primary" | "secondary" | "default" | "success" | "warning" | "danger"
	>(`default`);
	const [scoreLabel, setScoreLabel] = useState<string>(``);
	const [scoreValue, setScoreValue] = useState<number>(0);

	useEffect(() => {
		switch (color) {
			case "purple":
				setActColor("secondary");
				break;
			case "blue":
				setActColor("primary");
				break;
			case "green":
				setActColor("success");
				break;
			case "red":
				setActColor("danger");
				break;
			case "yellow":
				setActColor("warning");
				break;
			default:
				setActColor("default");
				break;
		}
	}, [accessToken, color]);

	const navigate = useNavigate();

	useEffect(() => {
		const { label, value } = ScoreLogic(score, defaultLanguage);
		setScoreLabel(label);
		setScoreValue(value);
	}, [accessToken, defaultLanguage, score]);

	return (
		<DropdownMenu variant="light" aria-label="dropdown menu">
			<DropdownSection showDivider>
				<DropdownItem isReadOnly key={`user`} className="h-14 opacity-100">
					<User
						name={username}
						description={email}
						classNames={{
							name: "text-default-600",
							description: "text-default-500",
						}}
						avatarProps={{
							color: actColor,
						}}
						// avatarProps={{
						// 	size: 'sm',
						// 	src: <Avatar name='asd' />,
						// 	alt: profile as string,
						// }}
					/>
				</DropdownItem>
				<DropdownItem key={`score`} isReadOnly>
					<div className="flex flex-row justify-center items-center">
						<Progress
							size="sm"
							radius="sm"
							className="w-full"
							label={scoreLabel}
							value={scoreValue}
						/>
						<Tooltip
							showArrow
							className="p-2"
							content={`${defaultLanguage === "en-US" ? `Points` : `Точки`}: ${score} ${defaultLanguage === "en-US" ? `p.` : `т.`}`}
						>
							<Button
								isIconOnly
								radius={`full`}
								size="sm"
								// className='w-full'
								color="primary"
							>
								{score > 1000 ? `${Math.round(score / 1000)}k` : `${score}`}
							</Button>
						</Tooltip>
						{/* <Chip radius="full">{score}</Chip> */}
					</div>
				</DropdownItem>
				<DropdownItem
					onPress={() => navigate("/user/profile")}
					key={profile as string}
					shortcut={<LayoutDashboard size={16} />}
				>
					{profile}
				</DropdownItem>
				<DropdownItem
					onPress={() => navigate("/user/settings")}
					key={settings as string}
					shortcut={<Settings size={16} />}
				>
					{settings}
				</DropdownItem>
				<DropdownItem
					key={`liked`}
					onPress={() => navigate("/user/liked")}
					shortcut={<Heart size={16} />}
				>
					{liked}
				</DropdownItem>
				<DropdownItem
					key={`watched`}
					onPress={() => navigate("/user/watched")}
					shortcut={<Clock3 size={16} />}
				>
					{watched}
				</DropdownItem>
			</DropdownSection>
			<DropdownSection showDivider>
				<DropdownItem
					isReadOnly
					key={`theme`}
					endContent={
						<select
							defaultValue={theme}
							onChange={(e) => {
								setTheme(e.target.value);
							}}
							className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
							id="theme"
							name="theme"
						>
							<option value={`system`}>{system}</option>
							<option value={`dark`}>{dark}</option>
							<option value={`light`}>{light}</option>
						</select>
					}
				>
					{themeText}
				</DropdownItem>
				<DropdownItem
					isReadOnly
					key={`language`}
					endContent={
						<select
							defaultValue={defaultLanguage}
							onChange={(e) => {
								changeLanguage(
									e.target.value as AppContextTypes["defaultLanguage"]
								);
							}}
							className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
							id="theme"
							name="theme"
						>
							<option value={`bg-BG`}>{bg}</option>
							<option value={`en-US`}>{en}</option>
						</select>
					}
				>
					{language}
				</DropdownItem>
			</DropdownSection>
			<DropdownSection>
				<DropdownItem
					key={logOut as string}
					isVirtualized
					onPress={() => {
						Cookies.remove("access-token");
						setAccessToken(false);
					}}
					shortcut={<LogOut size={16} />}
					color="danger"
				>
					{logOut as string}
				</DropdownItem>
			</DropdownSection>
		</DropdownMenu>
	);
};

export default LoggedInView;
