import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { useLocation } from "react-router-dom";
import { mediaType } from "./props.interface";
import { useDisclosure } from "@nextui-org/react";
import {
	PopularMovies,
	PopularTV,
	TrendingMovies,
	TrendingTV,
	NowPlayingMovies,
	NowPlayingTV,
} from "./onloadFuncs";

type mediaDataProps = {
	type: "popular" | "trending" | "now_playing";
	isMovie: boolean;
};

type mediaFetch = {
	movies: {
		results: mediaType[];
		total_pages: number;
	};
	tvShows: {
		results: mediaType[];
		total_pages: number;
	};
};

const useMediaData = ({ type, isMovie }: mediaDataProps) => {
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const page = queryParams.get("page") || "1";
	const [mediaData, setMediaData] = useState<mediaType[]>([] as mediaType[]);
	const [currPage, setCurrPage] = useState<number>(page ? Number(page) : 1);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [search, setSearch] = useState<string>("");
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [mediaId, setMediaId] = useState<number>(0);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		setLoading(true);


		if (isNaN(Number(currPage))) {
			setError(
				defaultLanguage === "en-US"
					? "Invalid page parameter. You can navigate back to look for other movies or shows."
					: "Невалиден параметър на страницата. Може да се навигирате назад, за да намерите други филми или сериали."
			);
			return;
		}

		const fetchMediaData = async (lang: string) => {
			try {
				const apiFunction = isMovie
					? type === "popular"
						? PopularMovies
						: type === "trending"
							? TrendingMovies
							: type === "now_playing"
								? NowPlayingMovies
								: () => {}
					: type === "popular"
						? PopularTV
						: type === "trending"
							? TrendingTV
							: type === "now_playing"
								? NowPlayingTV
								: () => {};

				const response = (await apiFunction(
					lang as AppContextTypes['defaultLanguage'],
					currPage as number
				)) as mediaFetch;
				const mazna = response.movies || response.tvShows;
				const data: mediaType[] = mazna.results || [];
				setMediaData(data);
				setTotalPages(mazna.total_pages || 0);

				if (
					typeof response === "undefined" ||
					response === null ||
					mazna.total_pages < currPage
				) {
					const msg =
						defaultLanguage === "en-US"
							? "Oops! Server Down.\nWe apologize, but it seems our server is currently experiencing some technical difficulties.\nPlease bear with us as we work to restore service. Thank you for your patience."
							: "Упс! Сървърът е изключен.\nИзвиняваме се, но изглежда, че нашият сървър в момента преживява технически затруднения.Моля, бъдете търпеливи, докато работим за възстановяването на услугата. Благодарим ви за търпението.";
					setError(msg);
					return;
				}

				setLoading(false);
			} catch (err) {
				const msg =
					defaultLanguage === "en-US"
						? "Oops! Server Down.\nWe apologize, but it seems our server is currently experiencing some technical difficulties.\nPlease bear with us as we work to restore service. Thank you for your patience."
						: "Упс! Сървърът е изключен.\nИзвиняваме се, но изглежда, че нашият сървър в момента преживява технически затруднения.Моля, бъдете търпеливи, докато работим за възстановяването на услугата. Благодарим ви за търпението.";
				setError(msg);
			}
		};
		fetchMediaData(defaultLanguage);
	}, [defaultLanguage, currPage, type, page, isMovie]);

	return {
		currPage,
		error,
		isLoading,
		isOpen,
		mediaData,
		mediaId,
		onOpen,
		onOpenChange,
		page,
		search,
		setCurrPage,
		setMediaId,
		setSearch,
		totalPages,
	} as useMediaDataTypes;
};

export default useMediaData;

type useMediaDataTypes = {
	currPage: number;
	error: string;
	isLoading: boolean;
	isOpen: boolean;
	mediaData: mediaType[] | [];
	mediaId: number;
	onOpen: () => void;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	page: string;
	search: string;
	setCurrPage: React.Dispatch<React.SetStateAction<number>>;
	setMediaId: React.Dispatch<React.SetStateAction<number>>;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	totalPages: number;
};
