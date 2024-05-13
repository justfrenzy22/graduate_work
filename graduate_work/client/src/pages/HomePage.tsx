import Header from "../components/HomePage/Header";
import React, { useContext, useEffect } from "react";
import { AppContext, AppContextTypes } from "../utils/AppContext";
import HomePageProvider from "../utils/HomePageContext";
import Popular from "../components/HomePage/Popular";
import NowPlaying from "../components/HomePage/NowPlaying";
import Trending from "../components/HomePage/Trending";

const HomePage: React.FC = (): JSX.Element => {
	const { theme, themeStyle, systemTheme, defaultLanguage } =
		useContext<AppContextTypes>(AppContext);

	useEffect(() => {
		document.title = ` CrackFlix  •  ${defaultLanguage === "bg-BG" ? "Вашият Безплатен Портал за Стрийминг на Филми и Сериали" : "Your Free Streaming Portal for Movies and TV Shows!"}`;
	}, [defaultLanguage]);


	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	return (
		<HomePageProvider>
			<div>
				<div
					className={`bg-gradient-to-tl ${themeStyle[themeKey as keyof typeof themeStyle]} w-full`}
				>
					<Header />
				</div>
				<div
					className={`bg-gradient-to-bl ${themeStyle[themeKey as keyof typeof themeStyle]} `}
				>
					<Popular />
				</div>
				<div
					className={`bg-gradient-to-tl ${themeStyle[themeKey as keyof typeof themeStyle]} `}
				>
					<Trending />
				</div>
				<div
					className={`bg-gradient-to-bl ${themeStyle[themeKey as keyof typeof themeStyle]} `}
				>
					<NowPlaying />
				</div>
			</div>
		</HomePageProvider>
	);
};

export default HomePage;
