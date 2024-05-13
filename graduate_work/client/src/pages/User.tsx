import { Suspense, useContext, useEffect, useState } from "react";
import Loader from "../components/App/Loader";
import { AppContext, AppContextTypes } from "../utils/AppContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import UserTabs from "../components/User/Tabs";
import Profile from "../components/User/Profile";
import Verify from "../components/User/Verify";
import { Toaster } from "react-hot-toast";
import SearchComp from "../components/App/Search";
import Liked from "../components/User/Liked";
import Watched from "../components/User/Watched";
import ErrorComponent from "../components/Movie/Error";
import Settings from "../components/User/Settings";
import Discord from "../components/User/Discord";
import Admin from "../components/User/Admin";

const User = (): JSX.Element => {
	const { defaultLanguage, theme, systemTheme, themeStyle, accessToken } =
		useContext<AppContextTypes>(AppContext);

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	const navigate = useNavigate();
	const location = useLocation();
	const currPath = location.pathname;
	const [search, setSearch] = useState<string>("");
	const [isFound, setFound] = useState<boolean>(true);

	useEffect(() => {
		if (!accessToken) {
			if (
				currPath.startsWith(`/user`) &&
				!currPath.startsWith(`/user/verify`)
			) {
				navigate(`/`);
			} else {
				setFound(!currPath.startsWith(`/user/verify`));
			}
		} else {
			const definedPaths = [
				"/user/verify/:token",
				"user/liked",
				"user/watched",
				"user/profile",
				"user/settings",
				"/user/admin",
				"user/discord",
			];
			const isDefinedPath = definedPaths.some((path) => currPath === path);
			setFound(!isDefinedPath);
		}
	}, [accessToken, currPath, navigate]);

	return (
		<div
			className={`min-h-[93.5vh] flex w-full justify-start pt-8 px-2 items-center flex-col gap-4 ${`bg-gradient-to-tl ${themeStyle[themeKey as keyof typeof themeStyle]} `}`}
		>
			{/* <div className="flex flex-col items-center py-4 gap-4"> */}
			<SearchComp search={search} setSearch={setSearch} />
			{isFound && <UserTabs />}
			<Suspense fallback={<Loader lang={defaultLanguage} />}>
				<Routes>
					{defaultLanguage ? (
						<>
							<Route path="/verify/:token" element={<Verify />} />
							<Route path="/liked" element={<Liked />} />
							<Route path="/watched" element={<Watched />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/discord" element={<Discord />} />
							<Route path="admin" element={<Admin />} />
							<Route
								path="*"
								element={
									<ErrorComponent
										errorText={
											defaultLanguage === "en-US" ? "Error 404" : "Грешка 404"
										}
										smallText={
											defaultLanguage === "en-US"
												? "Page not found"
												: "Страницата не е намерена"
										}
										backBtn={defaultLanguage === "en-US" ? "Back" : "Назад"}
									/>
								}
							/>
						</>
					) : (
						<Route path="*" element={<Loader lang={defaultLanguage} />} />
					)}
				</Routes>
			</Suspense>
			<Toaster position="top-right" />
			{/* </div> */}
		</div>
	);
};

export default User;
