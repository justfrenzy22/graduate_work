import React, { useContext, useEffect, useState } from 'react';
import PopularText from './PopularText';
import { TVChange, PopularTV } from '../App/handleFunctions';
import MediaList from './MediaList';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import {
	HomePageContext,
	HomePageContextTypes,
} from '../../utils/HomePageContext';
import Loader from '../App/Loader';
import { mediaType } from '../App/props.interface';
import ErrorComponent from '../Movie/Error';
import { MovieText, MovieTextTypes } from '../Movie/ErrorText';

const Popular: React.FC = () => {
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	const { popularMovies, error } =
		useContext<HomePageContextTypes>(HomePageContext);
	const [isMovies, setIsMovies] = useState<boolean>(true);
	const {
		popularTxt,
		popularMoviesText,
		popularTvSeriesText,
	}: {
		popularTxt: string;
		popularMoviesText: string;
		popularTvSeriesText: string;
	} = defaultLanguage === 'en-US' ? PopularText.en : PopularText.bg;
	const [popularTV, setPopularTV] = useState<mediaType[]>([]);
	const [isLoading, setLoading] = useState<boolean>(false);

	const handleTVChange: () => void = async () =>
		await TVChange(
			popularTV,
			defaultLanguage,
			setPopularTV,
			PopularTV,
			isMovies,
			setIsMovies,
			setLoading
		);

	useEffect(() => {
		setLoading(true);
		setIsMovies(true);
		setPopularTV([]);
		setLoading(false);
	}, [defaultLanguage]);

	if (isLoading || popularMovies.length === 0) {
		return <Loader lang={defaultLanguage} />;
	}

	if (error !== '' && typeof error === 'string') {
		const { backBtn, errorText } =
			defaultLanguage === 'en-US'
				? (MovieText.en as MovieTextTypes)
				: (MovieText.bg as MovieTextTypes);
		return (
			<ErrorComponent
				errorText={errorText}
				smallText={error}
				backBtn={backBtn}
			/>
		);
	}

	return (
		<>
			<MediaList
				title={popularTxt}
				buttonText1={popularMoviesText}
				buttonText2={popularTvSeriesText}
				moviesData={popularMovies}
				tvData={popularTV}
				handleTVChange={handleTVChange}
				isMovies={isMovies}
				setIsMovies={setIsMovies}
				type="popular"
			/>
		</>
	);
};

export default Popular;
