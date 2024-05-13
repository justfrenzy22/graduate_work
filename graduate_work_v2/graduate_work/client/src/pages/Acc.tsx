import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext, AppContextTypes } from "../utils/AppContext";
import { AccountFinder } from "../components/App/handleFunctions";
import { Button, Progress, Tooltip, User } from "@nextui-org/react";
import { ScoreLogic } from "../components/Nav/ScoreLogic";
import SearchComp from "../components/App/Search";

const Acc = () => {
	const { username } = useParams();
	const { theme, themeStyle, systemTheme, defaultLanguage } =
		useContext<AppContextTypes>(AppContext);
	const [accInfo, setAccInfo] = useState<string>();
	const [color, setColor] = useState<
		"primary" | "secondary" | "default" | "success" | "warning" | "danger"
	>("default");
	const [score, setScore] = useState<number>(0);
	const [scoreLabel, setScoreLabel] = useState<string>("");
	const [scoreValue, setScoreValue] = useState<number>(0);
	const [role, setRole] = useState("");
	const [email, setEmail] = useState<string>("");
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const [isCommingSoon, setIsCommingSoon] = useState<boolean>(false);
	const [search, setSearch] = useState<string>("");
	const [isError, setError] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		const func = async () => {
			const response = await AccountFinder(username as string, defaultLanguage);

			if (response.status == 200) {
				setAccInfo(response.message);
				const { label, value } = ScoreLogic(
					response.user.score,
					defaultLanguage
				);
				setRole(response.user.role);
				setIsPublic(response.user.isPublic);
				if (response.user.isPublic) {
					setEmail(response.user.email);
					setScore(response.user.score);
					setScoreLabel(label);
					setScoreValue(value);
				}
				switch (response.user.color) {
					case "purple":
						setColor("secondary");
						break;
					case "blue":
						setColor("primary");
						break;
					case "green":
						setColor("success");
						break;
					case "red":
						setColor("danger");
						break;
					case "yellow":
						setColor("warning");
						break;
					case "default":
						setColor("default");
						break;
					default:
						break;
				}

				switch (response.user.role) {
					case "admin":
						setRole(defaultLanguage == "en-US" ? "Admin" : "Администратор");
						break;
					case "user":
						setRole(defaultLanguage == "en-US" ? "User" : "Потребител");
						break;
					case "super-admin":
						setRole(
							defaultLanguage == "en-US" ? "Super Admin" : "Супер Администратор"
						);
						break;
					default:
						break;
				}
			} else {
				setError(true);
				setAccInfo(response.message);
			}
		};
		func();
	}, [color, defaultLanguage, score, username]);

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	return (
		<div
			className={`min-h-[93.5vh] flex w-full p-8 justify-start items-center flex-col gap-4 ${`bg-gradient-to-tl ${themeStyle[themeKey as keyof typeof themeStyle]} `}`}
		>
			<div className="mb-8">
				<SearchComp search={search} setSearch={setSearch} />
			</div>
			<div
				className={`flex flex-col z-50 mt-1 gap-4 p-8 rounded-2xl ${themeKey === "dark" ? "bg-[#00022A]" : "bg-[#ECECEC]"} w-[95vw] sm:w-[50vw] max-h-[520px] overflow-x-auto`}
			>
				{!isError ? (
					<div className="flex flex-col gap-4">
						<h1 className="text-xl font-bold">{accInfo}</h1>
						<div className="flex sm:justify-between justify-start items-center sm:flex-row flex-col gap-4">
							<User
								name={username}
								description={
									isPublic
										? email
										: defaultLanguage === "bg-BG"
											? "Недостъпен"
											: "Unavailable"
								}
								classNames={{
									name: "text-default-600",
									description: "text-default-500",
								}}
								avatarProps={{
									color: color,
								}}
							/>
							<Tooltip
								showArrow
								content={`${defaultLanguage === "en-US" ? `Role` : `Роля`}: ${role}`}
							>
								{role && <p className="text-default-500">{role}</p>}
							</Tooltip>
						</div>
						{isPublic ? (
							<div className="flex flex-row gap-2 justify-center items-center">
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
									<Button isIconOnly radius={`full`} size="sm" color="primary">
										{score > 1000 ? `${Math.round(score / 1000)}k` : `${score}`}
									</Button>
								</Tooltip>
							</div>
						) : (
							<div className="flex flex-row justify-between items-center">
								<h1>
									{defaultLanguage === "bg-BG"
										? "Този профил е частен"
										: "This profile is private"}
								</h1>
								<Tooltip
									isOpen={isCommingSoon}
									showArrow
									content={
										<div className="p-1">
											{defaultLanguage === "en-US"
												? "Comming Soon"
												: "Очаквайте скоро"}
										</div>
									}
								>
									<Button
										onPress={() => setIsCommingSoon(!isCommingSoon)}
										color="primary"
										radius="full"
										variant={isCommingSoon ? "bordered" : "solid"}
									>
										{defaultLanguage === "bg-BG" ? "Последвай" : "Follow"}
									</Button>
								</Tooltip>
							</div>
						)}
						{isPublic && (
							<Tooltip
								isOpen={isCommingSoon}
								showArrow
								content={
									<div className="p-1">
										{defaultLanguage === "en-US"
											? "Comming Soon"
											: "Очаквайте скоро"}
									</div>
								}
							>
								<div className="flex justify-center items-center">
									<Button
										onPress={() => setIsCommingSoon(!isCommingSoon)}
										color="primary"
										radius="full"
										className="w-[200px] text-center"
										variant={isCommingSoon ? "bordered" : "solid"}
									>
										{defaultLanguage === "bg-BG" ? "Последвай" : "Follow"}
									</Button>
								</div>
							</Tooltip>
						)}
					</div>
				) : (
					<div className="flex justify-center items-center">
						<h1 className="text-xl font-bold">{accInfo}</h1>
					</div>
				)}
				<Button
					onPress={() => navigate("/")}
					className="w-full mt-2"
					color="primary"
					variant="shadow"
					radius="full"
				>
					{defaultLanguage == "en-US" ? "HomePage" : "Начална страница"}
				</Button>
			</div>
		</div>
	);
};

export default Acc;
