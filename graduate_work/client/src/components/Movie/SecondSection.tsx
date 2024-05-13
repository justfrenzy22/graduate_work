import { Image, Button, Link, Divider, Tooltip } from "@nextui-org/react";
import { PlusCircle, StarIcon } from "lucide-react";
import { mediaType } from "../App/props.interface";
import React, { useContext, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import circleCheck from "../../assets/circle-check.svg";

import {
	SecondSectionText,
	SecondSectionTextTypes,
	lengths,
	lengthsTypes,
} from "./SecondSectionText";
import { AddRated, ToggleLikedFunc } from "../App/handleFunctions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

//`antd`

type SecondSectionType = {
	handleVoteAverage: (vote: number) => string;
	movieDetails: mediaType;
	setMovieDetails: React.Dispatch<React.SetStateAction<mediaType>>;
	handleReleaseDate: (date: string) => string;
	starsArr: string[];
	stars: number;
	showMore: boolean;
	setStars: React.Dispatch<React.SetStateAction<number>>;
	setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
	handleYearMonthDate: (date: string) => string;
};

interface detailsForItem {
	name: string;
	value:
		| string
		| Array<
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				mediaType["production_companies"][0] | mediaType["genres"][0] | any
 >;

	length: string;
}
const SecondSection: React.FC<SecondSectionType> = ({
	handleVoteAverage,
	movieDetails,
	handleReleaseDate,
	showMore,
	setMovieDetails,
	setShowMore,
	handleYearMonthDate,
}) => {
	const { defaultLanguage, systemTheme, theme, accessToken, onOpen } =
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

	const details: Array<detailsForItem> = [
		{
			name: Type,
			value: typeText,
			length: length1,
		},
		{
			name: Country,
			value: movieDetails?.production_countries,
			length: length2,
		},
		{
			name: Genres,
			value: movieDetails?.genres,
			length: length3,
		},
		{
			name: Release,
			value: handleYearMonthDate(movieDetails?.release_date),
			length: length4,
		},
		{
			name: Director,
			value: N_Atxt,
			length: length5,
		},
		{
			name: Production,
			value: movieDetails?.production_companies,
			length: length6,
		},
		{
			name: Homepage,
			value: movieDetails?.homepage,
			length: length7,
		},
	];

	const [checked, setChecked] = useState<boolean>(movieDetails?.check);
	const [rating, setRating] = useState<number>(
		movieDetails.rating
			? movieDetails.rating
			: Math.round(movieDetails?.vote_average) / 2
	);
	const [isRated, setIsRated] = useState<boolean>(false);
	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;
	const navigate = useNavigate();
	const handleToggleLiked = async () => {
		const mediaType = `movie`;
		const response = await ToggleLikedFunc(
			movieDetails.id,
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
		const mediaType = `movie`;
		const response = await AddRated(
			defaultLanguage,
			movieDetails.id,
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
			const newTvDetails = movieDetails;
			movieDetails.rating = rating;
			setMovieDetails(newTvDetails);
			setIsRated(false);
		}
	};

	return (
		<>
			<div className="flex flex-row sm:w-full w-[95vw] items-center p-4 gap-[30px] sm:bg-background/40 bg-background/40 dark:bg-default/40 rounded-xl ">
				{/* poster */}
				<div className="md:block hidden">
					<Image
						isBlurred
						className="h-[450px] min-w-[300px] mt-0 hover:shadow-indigo-600 select-none"
						shadow="lg"
						src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movieDetails?.poster_path}`}
						loading="lazy"
						alt={movieDetails?.title}
					/>
				</div>

				{/* info */}

				<div className="w-full">
					{/* Flex container for arranging elements in a row with space between */}
					<div className="flex flex-col-reverse sm:flex-row justify-between">
						{/* Left side of the information section */}
						<div className="">
							<div className="flex flex-row gap-2 items-center justify-start">
								{/* Ratings, release year, and runtime information */}
								<div className="flex h-5 items-center space-x-3 text-small">
									{/* Ratings */}
									<div className="flex flex-row space-x-2 items-center">
										<p className="">
											<StarIcon size={18} />
										</p>
										<p className="text-base select-none">
											{handleVoteAverage(movieDetails.vote_average)}
										</p>
									</div>
									{/* Vertical divider */}
									<Divider orientation="vertical" />
									{/* Release year */}
									<p className="text-base select-none">
										{movieDetails &&
											handleReleaseDate(movieDetails.release_date)}
									</p>
									{/* Vertical divider */}
									<Divider orientation="vertical" />
									{/* Runtime */}
									<div className="flex flex-row space-x-1 items-center">
										<p className="text-base select-none">
											{movieDetails?.runtime}
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
									{movieDetails && movieDetails.title}
								</h1>
							</div>
						</div>
						{/* Right side of the information section */}
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
														movieDetails.rating
															? movieDetails.rating
															: Math.round(movieDetails.vote_average) / 2
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
								{movieDetails.rating
									? defaultLanguage === "en-US"
										? "Your vote"
										: "Вашата оценка"
									: `${movieDetails.vote_average / 2} ${defaultLanguage === "en-US" ? `from` : `от`} ${movieDetails.vote_count} ${defaultLanguage === "en-US" ? `votes` : `гласовe`}`}
							</p>
						</div>
					</div>
					{/* Overview section */}
					<div className="my-4">
						<div className="mb-2">
							{/* Display either full overview or a truncated version */}
							{movieDetails && showMore
								? movieDetails.overview
								: movieDetails?.overview?.slice(0, 40) + "... "}
						</div>
						{/* Button to toggle between full and truncated overview */}
						<Button
							color="primary"
							variant="ghost"
							radius="full"
							onClick={() => setShowMore(!showMore)}
						>
							{showMore ? lessBtn : moreBtn}
						</Button>
					</div>
					{/* Detailed information section */}
					<div className="flex flex-col w-full mt-4">
						{/* Map through details array to display various information */}
						{details.map((detail: detailsForItem, idx: number) => (
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
															{val.name !== "" ? val.name : N_Atxt}
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
												showAnchorIcon={movieDetails?.homepage !== ""}
												underline="hover"
												color="foreground"
												onClick={() =>
													// window.open(movieDetails?.homepage, "_blank")
													movieDetails?.homepage !== ""
														? window.open(movieDetails?.homepage, "_blank")
														: null
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

export default SecondSection;

type del = {
	iso_3166_1: string;
	name: string;
	id: number;
};
