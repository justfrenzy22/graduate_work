import { Button, Divider, Image, Link, Tooltip } from "@nextui-org/react";
import { mediaType } from "../App/props.interface";
import { PlusCircle, StarIcon } from "lucide-react";
import { useContext, useState } from "react";
import {
	SecondSectionText,
	SecondSectionTextTypes,
	lengths,
	lengthsTypes,
} from "./SecondSectionText";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { AddRated, ToggleLikedFunc } from "../App/handleFunctions";
import toast from "react-hot-toast";
import circleCheck from "../../assets/circle-check.svg";
import { useNavigate } from "react-router-dom";

export type SecondSectionType = {
	// Function to handle the formatting of vote average, expects a number and returns a string.
	handleVoteAverage: (vote: number) => string;

	setTVDetails: React.Dispatch<React.SetStateAction<mediaType>>;

	// Holds details about TV/media, the exact structure of mediaType is not specified here.
	tvDetails: mediaType;

	// Function to handle the formatting of release date, expects a date string and returns a string.
	handleReleaseDate: (date: string) => string;

	// Array of strings, possibly representing star ratings or similar.
	starsArr: string[];

	// Numeric value for stars, likely representing a rating.
	stars: number;

	// Boolean to control the 'show more' feature, perhaps to expand/collapse additional information.
	showMore: boolean;

	// Function to update the 'stars' state, which is a React state setter function.
	setStars: React.Dispatch<React.SetStateAction<number>>;

	// Function to update the 'showMore' state, also a React state setter function.
	setShowMore: React.Dispatch<React.SetStateAction<boolean>>;

	// Function to handle formatting of year, month, and date from a date string.
	handleYearMonthDate: (date: string) => string;

	// An object representing a detail with a name, value, and length properties.
	// The type of value is not strictly defined; it could be a string, an array with objects containing a name, or any unknown type.
};

type detailType = {
	name: string;
	value:
		| string
		| Array<
				| mediaType["production_companies"][0]
				| mediaType["genres"][0]
				| mediaType["production_countries"][0]
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				| any
 >;
	length: string;
};

// Define a React functional component named SecondSection that takes props of type SecondSectionType
const SecondSection: React.FC<SecondSectionType> = ({
	handleVoteAverage,
	setTVDetails,
	tvDetails,
	handleReleaseDate,
	showMore,
	setShowMore,
	handleYearMonthDate,
}) => {
	const { defaultLanguage, isMobile, accessToken, theme, systemTheme, onOpen } =
		useContext<AppContextTypes>(AppContext);

	const {
		minutesText,
		moreBtn,
		lessBtn,
		Type,
		typeText,
		Country,
		Genres,
		Release,
		Director,
		N_Atxt,
		Production,
		Homepage,
		linkTxt,
		noHomePage,
	} =
		defaultLanguage === "en-US"
			? (SecondSectionText.en as SecondSectionTextTypes)
			: (SecondSectionText.bg as SecondSectionTextTypes);

	const { length1, length2, length3, length4, length5, length6, length7 } =
		defaultLanguage === "en-US"
			? (lengths.en as lengthsTypes)
			: (lengths.bg as lengthsTypes);
	const navigate = useNavigate();
	// Define an array of detail objects containing information about the TV show
	const details: Array<detailType> = [
		{ name: Type, value: typeText, length: length1 },

		{
			name: Country,
			value: tvDetails?.production_countries,
			length: length2,
		},
		{ name: Genres, value: tvDetails?.genres, length: length3 },
		{
			name: Release,
			value: handleYearMonthDate(tvDetails?.first_air_date),
			length: length4,
		},
		{ name: Director, value: N_Atxt, length: length5 },
		{
			name: Production,
			value: tvDetails?.production_companies,
			length: length6,
		},
		{ name: Homepage, value: tvDetails?.homepage, length: length7 },
	];
	const [checked, setChecked] = useState<boolean>(tvDetails?.check);
	const [rating, setRating] = useState<number>(
		tvDetails.rating
			? tvDetails.rating
			: Math.round(tvDetails?.vote_average) / 2
	);
	const [isRated, setIsRated] = useState<boolean>(false);
	// const [vote, setVote] = useState<number>(Math.ceil(Math.ceil(tvDetails?.vote_average) / 2));

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;
	const handleToggleLiked = async () => {
		const mediaType = `tv`;
		const response = await ToggleLikedFunc(
			tvDetails.id,
			mediaType,
			defaultLanguage
		);
		console.log(`there the problem?`);
		if (response.status === 200) {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
			setChecked(!checked);
		}
	};

	const handleAddRated = async () => {
		const mediaType = `tv`;
		const response = await AddRated(
			defaultLanguage,
			tvDetails.id,
			mediaType,
			rating
		);

		if (response.status === 200) {
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
			const newTvDetails = tvDetails;
			tvDetails.rating = rating;
			setTVDetails(newTvDetails);
			setIsRated(false);
		}
	};

	// JSX rendering for the component
	return (
		<>
			{/* Container for the TV show details */}
			<div className="flex flex-row sm:w-full w-[95vw] items-center p-4 gap-[30px] bg-background/40 dark:bg-default/40 rounded-xl ">
				{/* Poster section (visible only on larger screens) */}
				{!isMobile && (
					<div className="md:block hidden">
						<Image
							isBlurred
							className="h-[450px] min-w-[300px] mt-0 hover:shadow-indigo-600 select-none"
							shadow="lg"
							src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${tvDetails?.poster_path}`}
							loading="lazy"
							alt={tvDetails?.title}
						/>
					</div>
				)}
				{/* Information section */}
				<div className={`w-full`}>
					{/* Flex container for arranging elements in a row with space between */}
					<div className="flex flex-col-reverse sm:flex-row justify-between">
						{/* Left side of the information section */}
						<div className="">
							{/* Ratings, release year, and runtime information */}
							<div className="flex flex-row gap-2 items-center justify-start">
								<div className="flex h-5 items-center space-x-3 text-small">
									{/* Ratings */}
									<div className="flex flex-row space-x-2 items-center">
										<p className="">
											<StarIcon size={18} />
										</p>
										<p className="text-base select-none">
											{handleVoteAverage(tvDetails.vote_average)}
										</p>
									</div>
									{/* Vertical divider */}
									<Divider orientation="vertical" />
									{/* Release year */}
									<p className="text-base select-none">
										{tvDetails && handleReleaseDate(tvDetails.first_air_date)}
									</p>
									{/* Vertical divider */}
									<Divider orientation="vertical" />
									{/* Runtime */}
									<div className="flex flex-row space-x-1 items-center">
										<p className="text-base select-none">
											{tvDetails &&
											tvDetails?.episode_run_time &&
											tvDetails?.episode_run_time[0]
												? tvDetails.episode_run_time[0]
												: N_Atxt}
										</p>
										<p className="text-base select-none">{minutesText}</p>
									</div>
								</div>
								<Button
									className="bg-transparent hover:bg-[#452fde]/30"
									radius="full"
									isIconOnly
									onPress={() => {
										if (accessToken) {
											handleToggleLiked();
										} else {
											onOpen();
										}
									}}
								>
									{checked ? (
										<Image src={circleCheck} width={20} />
									) : (
										<PlusCircle size={20} color={"white"} />
									)}
								</Button>
							</div>
							{/* TV show title */}
							<div className="mt-4">
								<h1 className="text-3xl font-semibold">
									{tvDetails && tvDetails.name}
								</h1>
							</div>
						</div>
						{/* Right side of the information section */}
						<div>
							{/* Star rating input */}
							<div className="flex flex-col">
								<Tooltip
									classNames={{
										content: `bg-[${themeKey ? "#2a2a2a5d" : "#ffffffe9"}]`,
									}}
									isOpen={isRated}
									content={
										<div
											className={`p-3 flex flex-col gap-2 items-center justify-center ${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `}
										>
											<span>
												{defaultLanguage === "en-US"
													? `Your rating `
													: `Ваша оценка`}
												: {rating}
											</span>
											<div className="flex flex-row gap-2">
												<Button
													onClick={() => {
														setIsRated(false);
														setRating(
															tvDetails.rating
																? tvDetails.rating
																: Math.round(tvDetails.vote_average) / 2
														);
													}}
													color="danger"
													variant="faded"
													radius="full"
												>
													{defaultLanguage === "en-US" ? `Cancel` : `Затвори`}
												</Button>
												<Button
													color="primary"
													variant="shadow"
													radius="full"
													onPress={handleAddRated}
												>
													{defaultLanguage === "en-US" ? `Rate` : `Оцени`}
												</Button>
											</div>
										</div>
									}
								>
									<div className="flex items-center justify-center mr-4">
										<StarIcon
											onClick={() => {
												setRating(1);
												setIsRated(true);
											}}
											className={`${
												rating >= 1 ? "text-yellow-500" : "text-gray-400"
											} hover:text-yellow-700`}
										/>
										<StarIcon
											onClick={() => {
												setRating(2);
												setIsRated(true);
											}}
											className={`${
												rating >= 2 ? "text-yellow-500" : "text-gray-400"
											} hover:text-yellow-700`}
										/>
										<StarIcon
											onClick={() => {
												setRating(3);
												setIsRated(true);
											}}
											className={`${
												rating >= 3 ? "text-yellow-500" : "text-gray-400"
											} hover:text-yellow-700`}
										/>
										<StarIcon
											onClick={() => {
												setRating(4);
												setIsRated(true);
											}}
											className={`${
												rating >= 4 ? "text-yellow-500" : "text-gray-400"
											} hover:text-yellow-700`}
										/>
										<StarIcon
											onClick={() => {
												setRating(5);
												setIsRated(true);
											}}
											className={`${
												rating >= 5 ? "text-yellow-500" : "text-gray-400"
											} hover:text-yellow-700`}
										/>
									</div>
								</Tooltip>
								<p>
									{tvDetails.rating
										? defaultLanguage === "en-US"
											? "Your vote"
											: "Вашата оценка"
										: `${tvDetails.vote_average / 2} ${defaultLanguage === "en-US" ? `from` : `от`} ${tvDetails.vote_count} ${defaultLanguage === "en-US" ? `votes` : `гласовe`}`}
								</p>

								{/* <p className="text-sm text-gray-600">{rating}/5</p> */}
								{/* <div className="rating rating-lg rating-half">
									{Array.from({ length: 10 }).map((_, idx) => (
										<input
											key={idx}
											onClick={() => setStars(idx)}
											type="radio"
											name="rating-10"
											checked={idx === stars ? true : false}
											className={`${`bg-[#0802a3] mask mask-star-2 ${idx % 2 === 0 ? "mask-half-1" : "mask-half-2"}`} `}
										/>
									))}
								</div> */}
							</div>
							{/* Display selected star rating value */}
							{/* {starsArr[stars] && (
								<p className="text-base select-none">{starsArr[stars]}</p>
							)} */}
						</div>
					</div>
					{/* Overview section */}
					<div className="my-4">
						<div className="mb-2">
							{/* Display either full overview or a truncated version */}
							{tvDetails && showMore
								? tvDetails.overview
								: tvDetails?.overview?.slice(0, 40) + "... "}
						</div>
						{/* Button to toggle between full and truncated overview */}
						<Tooltip
							showArrow
							shadow="lg"
							className="bg-background/90"
							content={showMore ? lessBtn : moreBtn}
						>
							<Button
								color="primary"
								variant="ghost"
								radius="full"
								onClick={() => setShowMore(!showMore)}
							>
								{showMore ? lessBtn : moreBtn}
							</Button>
						</Tooltip>
					</div>
					{/* Detailed information section */}
					<div className="flex flex-col w-full mt-4">
						{/* Map through details array to display various information */}
						{details.map((detail: detailType, idx: number) => (
							<>
								{/* Flex container for arranging elements in a row with space between */}
								<div
									className={`flex flex-row justify-start`}
									style={{
										gap: detail.length,
									}}
									key={idx}
								>
									{/* Display detail name */}
									<span className="text-base opacity-30 select-none">
										{detail.name}
									</span>
									{/* Display detail value(s) */}
									<span className="flex flex-row flex-wrap gap-1 select-none">
										{/* Check if the value is an object (e.g., genres) */}
										{typeof detail.value === "object" ? (
											<>
												{/* Map through array values and display each with commas */}
												{detail.value.map((val: del, indx: number) => (
													<>
														<p
															onClick={() => {
																if (
																	detail.name === Country ||
																	detail.name === Genres ||
																	detail.name === Type
																) {
																	navigate(
																		`/filter?sort=popularity&type=multi&${detail.name === Country ? "country" : detail.name === Genres ? "genres" : detail.name === Type && "type"}=${detail.name === Country ? val.iso_3166_1 : detail.name === Genres ? val.id : detail.name === Type && val}`
																	);
																}
															}}
															key={indx}
															className="text-base opacity-50 hover:opacity-100 cursor-pointer"
														>
															{val.name !== "" ? val.name : "N/A"}
														</p>
														{/* Display comma (if not the last value) */}
														<p className="text-base opacity-50">
															{indx !== detail.value.length - 1 ? "," : ""}
														</p>
													</>
												))}
											</>
										) : idx === details.length - 1 ? (
											// Check if the last detail is a homepage link
											<Link
												showAnchorIcon={tvDetails?.homepage !== ""}
												underline="hover"
												color="foreground"
												onClick={() =>
													window.open(tvDetails?.homepage, "_blank")
												}
												className="opacity-50 text-base cursor-pointer"
											>
												{detail.value !== "" ? linkTxt : noHomePage}
											</Link>
										) : (
											// Display regular detail value
											<p className="text-base opacity-50 hover:opacity-100 cursor-pointer select-none">
												{detail.value}
											</p>
										)}
									</span>
								</div>
							</>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

// Export the SecondSection component
export default SecondSection;

type del = {
	iso_3166_1: string;
	name: string;
	id: number;
};
