import {
	Card,
	CardBody,
	Image,
	CardFooter,
	Tooltip,
	Divider,
} from '@nextui-org/react';
import { mediaType } from './props.interface';
import React, { useContext } from 'react';
import { Star } from 'lucide-react';
import { AppContext, AppContextTypes } from '../../utils/AppContext';

type CardComponentTypes = {
	data: mediaType;
	onOpen: () => void;
	setMediaId: React.Dispatch<React.SetStateAction<number>>;
	isMovie: boolean;
};

const CardComponent: React.FC<CardComponentTypes> = ({
	data,
	onOpen,
	setMediaId,
	isMovie,
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
				setMediaId(data?.id as number);
				onOpen();
				console.log(data?.id);
			}}
			className="bg-background/40 max-w-[285px] max-h-[435px"
		>
			<CardBody className="overflow-visible p-0 ">
				<Image
					width="100%"
					loading="lazy"
					className="object-cover select-none w-full"
					src={`https://www.themoviedb.org/t/p/w220_and_h330_face${data?.poster_path}`}
					alt={isMovie ? data?.title : data?.name}
				/>
			</CardBody>
			<CardFooter className={`flex justify-center flex-col h-[25%] `}>
				<Tooltip
					showArrow
					classNames={{
						content: 'bg-background/80',
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
						{isMovie
							? defaultLanguage === 'bg-BG'
								? 'Филм'
								: 'Movie'
							: defaultLanguage === 'bg-BG'
								? 'Сериал'
								: 'TV Show'}
					</p>
				</div>
			</CardFooter>
		</Card>
	);
};

export default CardComponent;
