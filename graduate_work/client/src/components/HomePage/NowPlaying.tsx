import React, { useContext, useState, useEffect } from 'react';
import NowPlayingText from './NowPlayingText';
import { TVChange, NowPlayingTV } from '../App/handleFunctions';
import MediaList from './MediaList';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import {
	HomePageContext,
	HomePageContextTypes,
} from '../../utils/HomePageContext';
import Loader from '../App/Loader';
import { mediaType } from '../App/props.interface';

const NowPlaying: React.FC = () => {
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	const { nowPlayingMovies } =
		useContext<HomePageContextTypes>(HomePageContext);
	const [isMovies, setIsMovies] = useState<boolean>(true);
	const {
		nowPlayingTxt,
		nowPlayingMoviesText,
		nowPlayingTvSeriesText,
	}: {
		nowPlayingTxt: string;
		nowPlayingMoviesText: string;
		nowPlayingTvSeriesText: string;
	} = defaultLanguage === 'en-US' ? NowPlayingText.en : NowPlayingText.bg;
	const [nowPlayingTV, setNowPlayingTV] = useState<mediaType[]>([]);
	const [isLoading, setLoading] = useState<boolean>(false);
	const { error } = useContext<HomePageContextTypes>(HomePageContext);

	const handleTVChange: () => void = async () =>
		await TVChange(
			nowPlayingTV,
			defaultLanguage,
			setNowPlayingTV,
			NowPlayingTV,
			isMovies,
			setIsMovies,
			setLoading
		);

	useEffect(() => {
		setIsMovies(true);
		setNowPlayingTV([]);
	}, [defaultLanguage]);

	if (error !== '' && typeof error === 'string') {
		return <></>;
	}

	if (isLoading || nowPlayingMovies.length === 0) {
		return <Loader lang={defaultLanguage} />;
	}

	return (
		<>
			<MediaList
				title={nowPlayingTxt}
				buttonText1={nowPlayingMoviesText}
				buttonText2={nowPlayingTvSeriesText}
				moviesData={nowPlayingMovies}
				tvData={nowPlayingTV}
				handleTVChange={handleTVChange}
				isMovies={isMovies}
				setIsMovies={setIsMovies}
				type="now_playing"
			/>
		</>
	);
};

export default NowPlaying;
