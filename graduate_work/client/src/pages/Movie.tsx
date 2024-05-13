import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { GetScore, MediaDetails } from "../components/App/handleFunctions";
import { AppContext, AppContextTypes } from "../utils/AppContext";
import Loader from "../components/App/Loader";
import {
	CommentI,
	ResponseType,
	mediaType,
} from "../components/App/props.interface";
import SearchComp from "../components/App/Search";
import FirstSection from "../components/Movie/FirstSection";
import SecondSection from "../components/Movie/SecondSection";
import { FirstSectionType } from "../components/Movie/FirstSection";
import ErrorComponent from "../components/Movie/Error";
import { MovieText, MovieTextTypes } from "../components/Movie/ErrorText";
import Recommended from "../components/Movie/Recommended";
import Comments from "../components/Movie/Comments";

const Movie = () => {
	const { movieId } = useParams<{ movieId: FirstSectionType["movieId"] }>();
	const [movieDetails, setMovieDetails] = useState<mediaType>({} as mediaType);
	const [error, setError] = useState<string>("");
	const [isLoading, setLoading] = useState<boolean>(true);
	const {
		defaultLanguage,
		theme,
		themeStyle,
		systemTheme,
		setAccessToken,
		set_Id,
		setEmail,
		setUsername,
		setRole,
		setPublic,
		setScore,
		accessToken,
		setVerified,
		setIsWatch,
		setColor,
	} = useContext<AppContextTypes>(AppContext);
	const { errorText, backBtn } =
		defaultLanguage === "en-US"
			? (MovieText.en as MovieTextTypes)
			: (MovieText.bg as MovieTextTypes);
	const [showMore, setShowMore] = useState<boolean>(false);
	const [stars, setStars] = useState<number>(0);
	const [search, setSearch] = useState<string>("");
	const [comments, setComments] = useState<CommentI[]>([] as CommentI[]);
	const [server, setServer] = useState<FirstSectionType["server"]>(
		"" as FirstSectionType["server"]
	);
	const [recommended, setRecommended] = useState<mediaType[]>([]);

	const possibleServers = useMemo(
		() => [
			{ label: "Server 1", value: "https://vidsrc.to/embed/movie/" },
			{ label: "Server 2", value: "https://vidsrc.me/embed/movie" },
			{ label: "Server 3", value: "https://www.2embed.cc/embed/" },
		],
		[]
	);

	const starsArr = [
		"dying",
		"appaling",
		"horrible",
		"very bad",
		"bad",
		"average",
		"fine",
		"good",
		"very good",
		"great",
		"excellent",
	];
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const handleVoteAverage = (vote: number): string => Number(vote).toFixed(1);

	const handleReleaseDate = (date: string): string => date?.split("-")[0] || "";

	const handleYearMonthDate = (date: string) => {
		const newDate = new Date(date);
		const day = newDate.getDate();
		const month = months[newDate.getMonth()];
		const year = newDate.getFullYear();
		return `${day} ${month} ${year}`;
	};

	useEffect(() => {
		if (isNaN(Number(movieId))) {
			setError(
				defaultLanguage === "en-US"
					? "Invalid movie ID. Go back to the homepage. You can navigate back to look for other movies."
					: "Невалидно ID на филма. Отидете назад към началната страница. Можете да навигирате назад, за да намерите други филми."
			);
			setLoading(false);
			return;
		}
		const fetchMovieDetails = async () => {
			try {
				const response = (await MediaDetails(
					Number(movieId) as number,
					defaultLanguage as AppContextTypes["defaultLanguage"],
					true as boolean
				)) as ResponseType;

				const resp = await GetScore();
				if (resp.status === 200) {
					setScore(resp.score);
				}
				if (response.status !== 200) {
					const msg = response?.message || "Failed to fetch movie details";
					setError(msg);
					setLoading(false);
				} else {
					setMovieDetails(response.details);
					setRecommended(response.recommended);
					if (accessToken && response.comments) {
						setComments(response.comments);
					}
					setLoading(false);
					document.title = "CrackFlix  •  " + response.details.title;
				}

				// }
			} catch (err) {
				console.log(`Failed to fetch movie details: `, err);
				const msg =
					defaultLanguage === "en-US"
						? "Oops! Server Down.\nWe apologize, but it seems our server is currently experiencing some technical difficulties.\nPlease bear with us as we work to restore service. Thank you for your patience."
						: "Упс! Сървърът е изключен.\nИзвиняваме се, но изглежда, че нашият сървър в момента преживява технически затруднения.Моля, бъдете търпеливи, докато работим за възстановяването на услугата. Благодарим ви за търпението.";
				setError(msg);
			}
		};
		fetchMovieDetails();
	}, [
		movieId,
		defaultLanguage,
		set_Id,
		setEmail,
		setUsername,
		setRole,
		setPublic,
		setScore,
		setVerified,
		setIsWatch,
		setColor,
		setAccessToken,
		accessToken,
	]);

	useEffect(() => {
		const localServer = localStorage.getItem(
			"server"
		) as FirstSectionType["server"];

		if (possibleServers.some((serv) => serv.value === localServer)) {
			setServer(localServer);
		} else {
			setServer(possibleServers[0].value as FirstSectionType["server"]);
			localStorage.setItem("server", possibleServers[0].value);
		}
	}, [possibleServers]);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Number(movieId)]);

	const handleServerChange = (newServer: FirstSectionType["server"]) => {
		setServer(newServer);
		localStorage.setItem("server", newServer);
	};

	if (error !== "") {
		return (
			<ErrorComponent
				errorText={errorText}
				smallText={error}
				backBtn={backBtn}
			/>
		);
	}

	if (isLoading || !movieDetails) {
		return <Loader lang={defaultLanguage} />;
	}

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	return (
		<div
			className={`bg-gradient-to-tl ${themeStyle[themeKey as keyof typeof themeStyle]} `}
		>
			<div className="flex flex-col min-h-[100vh] py-3 sm:py-[20px] gap-3 sm:gap-[20px]  px-[10px] sm:px-[60px]  items-center justify-center">
				{/* first section */}
				<SearchComp search={search} setSearch={setSearch} />

				<FirstSection
					movieId={movieId}
					server={server}
					setServer={setServer}
					possibleServers={possibleServers}
					handleServerChange={handleServerChange}
				/>
				{/* second section */}
				<SecondSection
					movieDetails={movieDetails}
					handleVoteAverage={handleVoteAverage}
					handleYearMonthDate={handleYearMonthDate}
					handleReleaseDate={handleReleaseDate}
					starsArr={starsArr}
					stars={stars}
					setMovieDetails={setMovieDetails}
					showMore={showMore}
					setShowMore={setShowMore}
					setStars={setStars}
				/>
			</div>
			<Recommended recommended={recommended} />
			<Comments comments={comments} mediaId={movieId} mediaType="movie" />
		</div>
	);
};

export default Movie;
