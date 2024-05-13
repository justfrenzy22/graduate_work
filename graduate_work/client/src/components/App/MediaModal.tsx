import React, { useContext, useEffect, useState } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Card,
	Skeleton,
	Divider,
	Image,
} from "@nextui-org/react";
import { MediaPreview, MediaTrailer, ToggleLikedFunc } from "./handleFunctions";
import { Play, PlusCircle, StarIcon } from "lucide-react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { useNavigate } from "react-router-dom";
import { ResponseType, mediaModalProps, mediaType } from "./props.interface";
import TVModalText from "./MediaModalText";
import circleCheck from "../../assets/circle-check.svg";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

type MediaModalProps = {
	mediaId: number;
	isMoviesMedia: boolean;
	isOpen: boolean;
	onOpenChange: () => void;
};

const MediaModal: React.FC<MediaModalProps> = ({
	mediaId,
	isMoviesMedia,
	isOpen,
	onOpenChange,
}) => {
	const navigate = useNavigate();
	const [trailer, setTrailer] = useState<string>(""); // State for trailer
	const { defaultLanguage, accessToken, onOpen, theme, systemTheme } =
		useContext<AppContextTypes>(AppContext); // Context for app
	const [mediaDetails, setMediaDetails] = useState<mediaType>({} as mediaType); // State for media details
	const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading status
	const [runtime, setRuntime] = useState<number>(0); // State for runtime
	const [checked, setChecked] = useState(false); // State for checkbox
	const { min, country, genre, closeBtn, playBtn } =
		defaultLanguage === "en-US"
			? (TVModalText.en as mediaModalProps["en"])
			: (TVModalText.bg as mediaModalProps["bg"]);

	useEffect(() => {
		if (isOpen) {
			setIsLoading(true);
			const waitDetails = async () => {
				const details = async () => {
					const token = Cookies.get(`access-token`);
					const response = (await MediaPreview(
						mediaId as number,
						defaultLanguage as AppContextTypes["defaultLanguage"],
						isMoviesMedia as boolean,
						token as string
					)) as ResponseType;
					const response2 = (await MediaTrailer(
						mediaId as number,
						isMoviesMedia as boolean
					)) as response2Fetch;

					type response2Fetch = {
						trailer: Array<{
							name: string;
							key: string;
						}>;
					};

					setMediaDetails(response.details);
					setChecked(response.details.check);
					setTrailer(
						response2.trailer.find((trail) => trail.name.includes("Trailer"))
							?.key || ""
					);
					setRuntime(
						isMoviesMedia
							? response.details.runtime
							: response.details.episode_run_time[0]
					);
				};

				await details(); // Fetch media details and trailer
			};

			waitDetails(); // Wait for media details and trailer
		} else {
			setMediaDetails({} as mediaType);
			setTrailer("");
		}

		setIsLoading(false); // Set loading state to false
	}, [isOpen, mediaId, defaultLanguage, isMoviesMedia]);

	if (!mediaId || !mediaDetails) {
		return null;
	}
	/**
	 * Handles the release date format
	 * @param {string} date - The release date
	 * @returns {string} - The formatted release year
	 */
	const handleReleaseDate = (date: string): string => date?.split("-")[0] || "";

	const handleToggleLiked = async () => {
		const mediaType = isMoviesMedia ? `movie` : `tv`;
		const response = await ToggleLikedFunc(mediaId, mediaType, defaultLanguage);
		console.log(`there the problem?`);
		if (response.status === 200) {
			const themeKey: AppContextTypes["theme"] =
				theme === "system" ? (systemTheme ? "dark" : "light") : theme;
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
	/**
	 * Formats the vote average by dividing it by 2 and returning a string representation with one decimal place.
	 *
	 * @param {number} vote_average - The vote average to be formatted
	 * @returns {string} - The formatted vote average
	 */
	const handleVoteAverage = (vote_average: number): string =>
		Number(vote_average).toFixed(1);

	return (
		<>
			<Modal
				backdrop="blur"
				className="bg-transparent/70 shadow-xl text-white "
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				classNames={{
					backdrop: "  ",
				}}
				size="5xl"
				placement="center"
				shadow="lg"
				motionProps={{
					variants: {
						enter: {
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.3,
								ease: "easeOut",
							},
						},
						exit: {
							y: -20,
							opacity: 0,
							transition: {
								duration: 0.2,
								ease: "easeIn",
							},
						},
					},
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							{isLoading || mediaDetails.length === 0 ? (
								<Card className="w-[200px] space-y-5 p-4" radius="lg">
									<Skeleton className="rounded-lg">
										<div className="h-24 rounded-lg bg-default-300"></div>
									</Skeleton>
									<div className="space-y-3">
										<Skeleton className="w-3/5 rounded-lg">
											<div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
										</Skeleton>
										<Skeleton className="w-4/5 rounded-lg">
											<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
										</Skeleton>
										<Skeleton className="w-2/5 rounded-lg">
											<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
										</Skeleton>
									</div>
								</Card>
							) : (
								<>
									{/* { console.log(`name of tv series`, mediaDetails) } */}
									<ModalHeader className="flex flex-row gap-4 jusitfy-center items-center select-none">
										{isMoviesMedia && mediaDetails
											? mediaDetails.title
											: mediaDetails.name}
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
									</ModalHeader>
									<ModalBody>
										<div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[40px] justify-between items-center">
											{/* first section */}
											<div className="flex flex-col gap-1">
												{/* rating/release year/runtime */}
												<div className="flex h-5 items-center space-x-3 text-small">
													{/* rating */}
													<div className="flex flex-row space-x-2 items-center">
														<p className="text-white">
															<StarIcon size={18} />
														</p>
														<p className="text-base select-none">
															{handleVoteAverage(mediaDetails.vote_average)}
														</p>
													</div>
													<Divider orientation="vertical" />
													{/* release year */}
													<p className="text-base select-none">
														{isMoviesMedia
															? handleReleaseDate(mediaDetails.release_date)
															: handleReleaseDate(mediaDetails.first_air_date)}
													</p>
													<Divider orientation="vertical" />
													{/* runtime */}
													<div className="flex flex-row space-x-1 items-center">
														<p className="text-base select-none">
															{runtime ? runtime : "NaN"}
														</p>
														<p className="text-base select-none">{min}</p>
													</div>
												</div>
												{/* country/genre/overview */}
												<div className="flex flex-col gap-1">
													{/* country */}
													<div className="flex flex-row space-x-1">
														<p className="text-base opacity-30 select-none">
															{country} :
														</p>
														<div className="flex flex-col space-x-1 sm:flex-row select-none">
															{mediaDetails ? (
																<>
																	{isMoviesMedia !== null
																		? mediaDetails.production_countries &&
																			mediaDetails.production_countries.map(
																				(country, idx) => (
																					<div
																						key={idx}
																						className="flex flex-row"
																					>
																						<p className="text-base opacity-50 hover:opacity-100 cursor-pointer">
																							{country.name}
																						</p>
																						<p className="text-base opacity-50 select-none">
																							{idx !==
																							mediaDetails.production_countries
																								.length -
																								1
																								? ", "
																								: ""}
																						</p>
																					</div>
																				)
																			)
																		: mediaDetails.origin_country &&
																			mediaDetails.origin_country.map(
																				(country, idx) => (
																					<div
																						key={idx}
																						className="flex flex-row"
																					>
																						<p className="text-base opacity-50 hover:opacity-100 cursor-pointer">
																							{country.name}
																						</p>
																						<p className="text-base opacity-50 select-none">
																							{idx !==
																							mediaDetails.origin_country
																								.length -
																								1
																								? ", "
																								: ""}
																						</p>
																					</div>
																				)
																			)}
																</>
															) : (
																<></>
															)}
														</div>
													</div>
													{/* genre */}
													<div className="flex flex-row space-x-1 mb-4">
														<p className="text-base opacity-30 select-none">
															{genre} :
														</p>
														{mediaDetails ? (
															<>
																{mediaDetails.genres &&
																	mediaDetails.genres.map((genre, idx) => (
																		<div
																			key={idx}
																			className="flex flex-row select-none"
																		>
																			<p className="text-base opacity-50 hover:opacity-100 cursor-pointer">
																				{genre.name}
																			</p>
																			<p className="text-base opacity-50">
																				{idx !== mediaDetails.genres.length - 1
																					? ", "
																					: ""}
																			</p>
																		</div>
																	))}
															</>
														) : (
															<></>
														)}
													</div>
													{/* overview */}
													<div>
														{mediaDetails ? (
															<p className="text-base opacity-50 select-none">
																{mediaDetails?.overview?.length > 150 &&
																	mediaDetails?.overview.substring(0, 150) +
																		"..."}
															</p>
														) : (
															<></>
														)}
													</div>
												</div>
											</div>
											{/* second section */}
											<div>
												<iframe
													className=" min-w-[45vh]  min-h-[200px] sm:w-full select-none"
													src={`https://www.youtube.com/embed/${trailer}`}
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
													title="YouTube video player"
													allowFullScreen
												></iframe>
											</div>
										</div>
									</ModalBody>
									<ModalFooter>
										<Button
											radius="full"
											color="danger"
											variant="light"
											onPress={onClose}
										>
											{closeBtn}
										</Button>
										<Button
											radius="full"
											color="primary"
											variant="shadow"
											onPress={() => {
												navigate(
													`${isMoviesMedia ? "/movie" : "/tv"}/${mediaDetails.id}${isMoviesMedia ? "" : "/1/1"}`
												); onClose();}
											}
										>
											{playBtn}
											<Play size={16} />
										</Button>
									</ModalFooter>
								</>
							)}
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default MediaModal;
