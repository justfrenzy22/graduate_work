import {
	Card,
	CardBody,
	Image,
	CardFooter,
	Tooltip,
	Divider,
} from '@nextui-org/react';
import React, { useContext } from 'react';
import { Star } from 'lucide-react';
import { mediaType } from '../App/props.interface';
import { AppContext, AppContextTypes } from '../../utils/AppContext';

type CardComponentTypes = {
	data: mediaType;
	onOpen: () => void;
	setMediaId: React.Dispatch<React.SetStateAction<number>>;
	setMovieMedia: React.Dispatch<React.SetStateAction<boolean>>;
};

const CardComponent: React.FC<CardComponentTypes> = ({
	data,
	onOpen,
	setMediaId,
	setMovieMedia,
}) => {
	const handleReleaseDate = (date: string): string =>
		date?.split('-')[0] || '';

	const handleVoteAverage = (vote: number): string =>
		(vote as number).toFixed(1);

	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);

	return (
		<Card
			isPressable
			onPress={() => {
				// if (data.backdrop_path) {
					setMediaId(data.id as number);
					setMovieMedia(data.media_type === 'movie');
					onOpen();
				// }
			}}
			className="bg-background/40 "
		>
			{data.media_type !== 'person' ? (
				<>
					<CardBody className="overflow-visible p-0 ">
						<Image
							width="100%"
							loading="eager"
							className="w-full object-cover select-none"
							src={`https://www.themoviedb.org/t/p/w220_and_h330_face${data?.poster_path}`}
							alt={
								data.media_type === 'tv'
									? data?.name
									: data?.title
							}
						/>
					</CardBody>
					<CardFooter
						className={`flex justify-center flex-col h-[25%] `}
					>
						<Tooltip
							showArrow
							classNames={{
								content: 'bg-background/80',
							}}
							shadow="lg"
							content={
								data.media_type === 'movie'
									? data?.title
									: data.media_type === 'tv'
										? data?.name
										: data.original_name
							}
						>
							<p className="font-bold truncate w-[100%]">
								{data.media_type === 'movie'
									? data?.title
									: data.media_type === 'tv'
										? data?.name
										: data.original_name}
							</p>
						</Tooltip>
						<div className="flex flex-row justify-center items-center gap-2">
							<p className=" text-sm">
								{handleReleaseDate(
									data.media_type === 'movie'
										? (data?.release_date as mediaType['release_date'])
										: (data?.first_air_date as mediaType['first_air_date'])
								)}
							</p>
							<Divider orientation="vertical" />
							<Star size={12} />
							<p className="text-sm">
								{data.vote_average
									? handleVoteAverage(
											data.vote_average as mediaType['vote_average']
										)
									: ''}
							</p>
							<Divider orientation="vertical" />
							<p className="text-sm">
								{data.media_type === 'movie'
									? defaultLanguage === 'bg-BG'
										? 'Филм'
										: 'Movie'
									: defaultLanguage === 'bg-BG'
										? 'Сериал'
										: 'TV Show'}
							</p>
						</div>
					</CardFooter>
				</>
			) : (
				<CardBody className="flex justify-center items-center">
					<p>{data?.name}</p>
				</CardBody>
			)}
		</Card>
	);
};

export default CardComponent;
