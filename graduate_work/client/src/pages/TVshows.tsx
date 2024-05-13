import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
	CommentI,
	ResponseType,
	mediaType,
} from "../components/App/props.interface";
import { AppContext, AppContextTypes } from "../utils/AppContext";
import SearchComp from "../components/App/Search";
import FirstSection, { FirstSectionType } from "../components/TV/FirstSection";
import { GetScore, MediaDetails } from "../components/App/handleFunctions";
import SecondSection from "../components/TV/SecondSection";
import { TVText, TVTextTypes } from "../components/TV/ErrorText";
import ErrorComponent from "../components/TV/Error";
import Loader from "../components/App/Loader";
import Recommended from "../components/Movie/Recommended";
import Comments from "../components/Movie/Comments";

const TVshows = () => {
	const { tvId, season, episode } = useParams<{
		tvId: FirstSectionType["tvId"];
		season: string;
		episode: string;
	}>();
	const [tvDetails, setTVDetails] = useState<mediaType>({} as mediaType);
	const [recommended, setRecommended] = useState<mediaType[]>([]);
	const [error, setError] = useState<string>("");
	const [isLoading, setLoading] = useState<boolean>(true);
	const { defaultLanguage, theme, themeStyle, systemTheme, setScore } =
		useContext<AppContextTypes>(AppContext);
	const { errorText, smallText, backBtn } =
		defaultLanguage === "en-US"
			? (TVText.en as TVTextTypes)
			: (TVText.bg as TVTextTypes);
	// const { errorText, smallText, backBtn } : { errorText: string, smallText: string, backBtn: string} = defaultLanguage === "en" ? MovieText.en : MovieText.bg;
	const [showMore, setShowMore] = useState<boolean>(false);
	const [stars, setStars] = useState<number>(0);
	const [search, setSearch] = useState<string>("");
	const [comments, setComments] = useState<CommentI[]>([]);
	const [server, setServer] = useState<FirstSectionType["server"]>(
		"" as FirstSectionType["server"]
	);

	const possibleServers = useMemo(
		() => [
			{ label: "Server 1", value: "https://vidsrc.to/embed/tv/" },
			{ label: "Server 2", value: "https://vidsrc.me/embed/tv?tmdb=" },
			{ label: "Server 3", value: "https://www.2embed.cc/embedtv/" },
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
		const localServer = localStorage.getItem(
			"tv-server"
		) as FirstSectionType["server"];

		if (possibleServers.some((server) => server.value === localServer)) {
			setServer(localServer);
		} else {
			setServer(possibleServers[0].value as FirstSectionType["server"]);
			localStorage.setItem("tv-server", possibleServers[0].value);
		}
	}, [possibleServers]);

	const handleServerChange = (newServer: FirstSectionType["server"]) => {
		setServer(newServer);
		localStorage.setItem("tv-server", newServer);
	};

	useEffect(() => {
		if (isNaN(Number(tvId))) {
			setError(
				defaultLanguage === "en-US"
					? "Invalid TV Show ID. You can navigate back to look for other tv shows."
					: "Невалидно ID на филма.  Може да се навигирате назад, за да намерите други сериали. "
			);
			setLoading(false);
			return;
		}

		if (isNaN(Number(season)) || isNaN(Number(episode))) {
			setError(
				defaultLanguage === "en-US"
					? "Invalid season or episode parameter. You can navigate back to look for other tv shows."
					: "Невалиден сезон или епизод параметър.  Може да се навигирате назад, за да намерите други сериали."
			);
			setLoading(false);
			return;
		}

		const fetchTVDetails = async () => {
			try {
				const response = (await MediaDetails(
					Number(tvId) as number,
					defaultLanguage as AppContextTypes["defaultLanguage"],
					false as boolean,
					season,
					episode
				)) as ResponseType;
				const resp = await GetScore();
				if (resp.status === 200) {
					setScore(resp.score);
				}

				if (response.status !== 200) {
					const msg = response?.message || "Failed to fetch movie details";
					setError(msg);
				} else {
					setTVDetails(response.details);
					setRecommended(response.recommended);
					setComments(response.comments);

					if (
						Number(season) > response.details.seasons.length ||
						Number(season) <= 0 ||
						response.details.seasons[Number(season) - 1].episode_count === 0 ||
						Number(episode) >
							response.details.seasons[Number(season) - 1].episode_count ||
						Number(episode) <= 0
					) {
						setError(smallText);
					}
				}
				setTVDetails(response.details);
				document.title = `CrackFlix • ${response.details.name} (${response.details.seasons[Number(season) - 1].name})`;
				setLoading(false);
			} catch (err) {
				console.log(`Failed to fetch movie details: `, err);
				const msg =
					defaultLanguage === "en-US"
						? "Oops! Server Down.\nWe apologize, but it seems our server is currently experiencing some technical difficulties.\nPlease bear with us as we work to restore service. Thank you for your patience."
						: "Упс! Сървърът е изключен.\nИзвиняваме се, но изглежда, че нашият сървър в момента преживява технически затруднения.Моля, бъдете търпеливи, докато работим за възстановяването на услугата. Благодарим ви за търпението.";
				setError(msg);
			}
		};
		fetchTVDetails();
	}, [tvId, defaultLanguage, season, episode, smallText, setScore]);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, []);

	if (error !== "") {
		return (
			<ErrorComponent
				errorText={errorText}
				smallText={error}
				backBtn={backBtn}
			/>
		);
	}

	if (isLoading || !tvDetails) {
		return <Loader lang={defaultLanguage} />;
	}

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	return (
		<div
			className={`bg-gradient-to-tl ${themeStyle[themeKey as keyof typeof themeStyle]} `}
		>
			<div className="flex flex-col min-h-[100vh] py-3 sm:py-[20px] gap-3 sm:gap-[20px]  px-[10px] sm:px-[60px]  items-center justify-center">
				{/* search bar */}
				<SearchComp search={search} setSearch={setSearch} />

				{/* first section */}
				<FirstSection
					tvId={tvId}
					server={server}
					setServer={setServer}
					season={season}
					episode={episode}
					tvDetails={tvDetails}
					possibleServers={possibleServers}
					handleServerChange={handleServerChange}
				/>

				{/* second section */}
				<SecondSection
					handleReleaseDate={handleReleaseDate}
					tvDetails={tvDetails}
					handleVoteAverage={handleVoteAverage}
					starsArr={starsArr}
					stars={stars}
					setStars={setStars}
					setTVDetails={setTVDetails}
					showMore={showMore}
					setShowMore={setShowMore}
					handleYearMonthDate={handleYearMonthDate}
				/>
			</div>
			{/* recommended section */}
			<Recommended recommended={recommended} />
			<Comments comments={comments} mediaId={tvId} mediaType="tv" />
		</div>
	);
};

export default TVshows;
