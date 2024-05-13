import { createContext, useContext, useEffect, useState } from "react";
import {
	NowPlayingMovies,
	PopularMovies,
	TrendingMovies,
} from "../components/App/onloadFuncs";
import { useDisclosure } from "@nextui-org/react";
import { AppContext, AppContextTypes } from "./AppContext";
import { movieType } from "../components/App/props.interface";

export const HomePageContext = createContext<HomePageContextTypes>(
	{} as HomePageContextTypes
);

const HomePageProvider = ({
	children,
}: {
	children: JSX.Element;
}): JSX.Element => {
	const { defaultLanguage }: AppContextTypes = useContext<AppContextTypes>(AppContext);
	const [popularMovies, setPopularMovies] = useState<movieType[]>([]);
	const [trendingMovies, setTrendingMovies] = useState<movieType[]>([]);
	const [nowPlayingMovies, setNowPlayingMovies] = useState<movieType[]>([]);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [mediaId, setMediaId] = useState<number>(0);
	const [isMoviesMedia, setIsMovieMedia] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const [errorShow, setErrorShow] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const abortController = new AbortController();

		const movies = async (lang: AppContextTypes['defaultLanguage']) => {
			try {
				const popularPromise = PopularMovies(lang, 1) as Promise<movieFetch>;
				const trendingPromise = TrendingMovies(lang, 1) as Promise<movieFetch>;
				const nowPlayingPromise = NowPlayingMovies(
					lang,
					1
				) as Promise<movieFetch>;

				const [popularFetch, trendingFetch, nowPlayingFetch] =
					await Promise.all([
						popularPromise,
						trendingPromise,
						nowPlayingPromise,
					]);


				if (isMounted) {
					const popular: movieType[] = popularFetch?.movies?.results || [];
					const trending: movieType[] = trendingFetch?.movies?.results || [];
					const nowplaying: movieType[] =
						nowPlayingFetch?.movies?.results || [];

					if (
						popular.length === 0 ||
						trending.length === 0 ||
						nowplaying.length === 0
					) {
						setError(
							defaultLanguage === "bg-BG"
								? "Упс! Възникна проблем от наша страна. Работим за отстраняването на проблема. Моля, опитайте отново по-късно."
								: "Oops! Something went wrong on our end. We're working to fix the issue. Please try again later."
						);
						setPopularMovies([]);
						setTrendingMovies([]);
						setNowPlayingMovies([]);
					} else {
						setPopularMovies(popular);
						setTrendingMovies(trending);
						setNowPlayingMovies(nowplaying);
					}
				}
			} catch (error) {
				if (isMounted) {
					setError(
						defaultLanguage === "bg-BG"
							? "Упс! Възникна проблем от наша страна. Работим за отстраняването на проблема. Моля, опитайте отново по-късно."
							: "Oops! Something went wrong on our end. We're working to fix the issue. Please try again later."
					);
					setPopularMovies([]);
					setTrendingMovies([]);
					setNowPlayingMovies([]);
				}
			}
		};

		type movieFetch = {
			movies: {
				results: movieType[];
			};
		};
		movies(defaultLanguage);

		return () => {
			isMounted = false;
			abortController.abort();
		}
	}, [defaultLanguage]);

	const value: HomePageContextTypes = {
		popularMovies,
		trendingMovies,
		nowPlayingMovies,
		isOpen,
		onOpen,
		onOpenChange,
		mediaId,
		setMediaId,
		isMoviesMedia,
		setIsMovieMedia,
		error,
		errorShow,
		setErrorShow,
	};

	return (
		<HomePageContext.Provider value={value}>
			{children}
		</HomePageContext.Provider>
	);
};

export default HomePageProvider;

export type HomePageContextTypes = {
	popularMovies: movieType[];
	trendingMovies: movieType[];
	nowPlayingMovies: movieType[];
	isOpen: boolean;
	onOpen: () => void;
	onOpenChange: () => void;
	mediaId: number;
	setMediaId: React.Dispatch<React.SetStateAction<number>>;
	isMoviesMedia: boolean;
	setIsMovieMedia: React.Dispatch<React.SetStateAction<boolean>>;
	error: string;
	errorShow: boolean;
	setErrorShow: React.Dispatch<React.SetStateAction<boolean>>;
};
