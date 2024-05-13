import { Card, CardBody, CardFooter, Image, Tooltip } from "@nextui-org/react";
import React, { useContext } from "react";
import { Star } from "lucide-react";
import { CardProps, mediaType } from "../App/props.interface";
// import handle from './handleFunctions';
import {
	HomePageContext,
	HomePageContextTypes,
} from "../../utils/HomePageContext";

/**
 * Renders a card component for displaying movie or TV show data.
 *
 * @param {CardProps} data - The data object containing information about the movie or TV show.
 * @param {boolean} isMovies - Indicates whether the data is for a movie or TV show.
 * @return {JSX.Element} The rendered card component.
 */
const CardComponent: React.FC<CardProps> = ({
	data,
	isMovie,
}: CardProps): JSX.Element => {
	const { onOpen, setMediaId } =
		useContext<HomePageContextTypes>(HomePageContext);

	const handleReleaseDate = (
		release_date: CardProps["data"]["release_date"]
	): string => release_date?.split("-")[0] || "";

	const handleVoteAverage = (
		vote_average: CardProps["data"]["vote_average"]
	): string => (vote_average as number).toFixed(1);

	return (
		<Card
			isPressable
			onPress={() => {
				setMediaId(data?.id as number);
				onOpen();
			}}
			className="bg-background/40 "
		>
			<CardBody className="overflow-visible p-0 ">
				<Image
					width="100%"
					loading="lazy"
					className="w-full object-cover select-none"
					src={`https://www.themoviedb.org/t/p/w220_and_h330_face${data?.poster_path}`}
					alt={isMovie ? data?.title : data?.name}
				/>
			</CardBody>
			<CardFooter className={`flex justify-center flex-col h-[25%] `}>
				<Tooltip
					showArrow
					classNames={{
						content: "bg-background/80",
					}}
					shadow="lg"
					content={isMovie ? data?.title : data?.name}
				>
					<p className="font-bold truncate w-[100%]">
						{isMovie ? data?.title : data?.name}
					</p>
				</Tooltip>
				<div className="flex flex-row justify-center items-center gap-2">
					<p className=" text-sm">
						{handleReleaseDate(
							isMovie
								? (data?.release_date as mediaType["release_date"])
								: (data?.first_air_date as mediaType["first_air_date"])
						)}
					</p>
					<p></p>
					<Star size={12} />
					<p className="text-sm">
						{handleVoteAverage(data.vote_average as mediaType["vote_average"])}
					</p>
				</div>
			</CardFooter>
		</Card>
	);
};

export default CardComponent;
