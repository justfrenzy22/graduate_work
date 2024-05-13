import React, { useContext, useState, useEffect } from "react";
import TrendingText from "./TrendingText";
import { TVChange, TrendingTV } from "../App/handleFunctions";
import MediaList from "./MediaList";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import {
	HomePageContext,
	HomePageContextTypes,
} from "../../utils/HomePageContext";
import Loader from "../App/Loader";
import { mediaType } from "../App/props.interface";

const Trending: React.FC = () => {
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	const { trendingMovies, error } =
		useContext<HomePageContextTypes>(HomePageContext);
	const [isMovies, setIsMovies] = React.useState<boolean>(true);
	const {
		trendingTxt,
		trendingMoviesText,
		trendingTvSeriesText,
	}: {
		trendingTxt: string;
		trendingMoviesText: string;
		trendingTvSeriesText: string;
	} = defaultLanguage === "en-US" ? TrendingText.en : TrendingText.bg;
	const [trendingTV, setTrendingTV] = useState<mediaType[]>([]);
	const [isLoading, setLoading] = useState<boolean>(false);

	const handleTVChange: () => void = async () =>
		await TVChange(
			trendingTV,
			defaultLanguage,
			setTrendingTV,
			TrendingTV,
			isMovies,
			setIsMovies,
			setLoading
		);

	useEffect(() => {
		setIsMovies(true);
		setTrendingTV([]);
	}, [defaultLanguage]);

	if (error !== "" && typeof error === "string") {
		return <></>;
	}
	if (isLoading || trendingMovies.length === 0) {
		return <Loader lang={defaultLanguage} />;
	}

	return (
		<>
			<MediaList
				title={trendingTxt}
				buttonText1={trendingMoviesText}
				buttonText2={trendingTvSeriesText}
				moviesData={trendingMovies}
				tvData={trendingTV}
				handleTVChange={handleTVChange}
				isMovies={isMovies}
				setIsMovies={setIsMovies}
				type="trending"
			/>
		</>
	);
};

export default Trending;
