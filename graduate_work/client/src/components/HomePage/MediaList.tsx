import React, { useContext } from 'react';
import { Button, Link } from '@nextui-org/react';
// import CardComponent from "./CardComponent";
import AdsComponent from './AdsComponent';
import { mediaType } from '../App/props.interface';
import { mediaImportProps } from '../App/props.interface';
import CardComponent from '../App/CardComponent';
import {
	HomePageContext,
	HomePageContextTypes,
} from '../../utils/HomePageContext';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
const MediaList: React.FC<mediaImportProps> = ({
	title,
	buttonText1,
	buttonText2,
	moviesData,
	tvData,
	handleTVChange,
	isMovies,
	setIsMovies,
	type,
}) => {
	const { onOpen, setMediaId, setIsMovieMedia } =
		useContext<HomePageContextTypes>(HomePageContext);
	const { defaultLanguage, isMobile } =
		useContext<AppContextTypes>(AppContext);
	const navigate = useNavigate();
	// Render the list of movies or TV shows
	// Render the media list
	return (
		<div className="flex flex-col md:flex-row gap-4 py-[10px] sm:px-[40px] px-[10px]">
			<div className="flex flex-col">
				<div className="flex justify-between">
					<div className="flex flex-row items-center gap-3 justify-start mb-4">
						{/* Render the title */}
						<Link
							className="cursor-pointer text-xl font-bold rounded-full"
							color="primary"
						>
							{title}
						</Link>
						<div className="flex flex-row gap-1">
							{/* Render button 1 */}
							<Button
								radius="full"
								color="primary"
								onPress={() => {
									if (!isMovies) {
										setIsMovieMedia(true);
										setIsMovies(true);
									}
								}}
								variant={isMovies ? 'shadow' : 'ghost'}
							>
								{buttonText1}
							</Button>
							{/* Render button 2 */}
							<Button
								radius="full"
								color="primary"
								onPress={() => {
									if (isMovies) {
										setIsMovieMedia(false);
										handleTVChange();
									}
								}}
								variant={!isMovies ? 'shadow' : 'ghost'}
							>
								{buttonText2}
							</Button>
						</div>
					</div>
					<div>
						{isMobile ? (
							<Button
								isIconOnly
								onClick={() =>
									navigate(
										`/${isMovies ? 'movie' : 'tv'}/${type}?page=1`
									)
								}
								variant="ghost"
								color="primary"
								radius='full'
							>
								<Plus size={16} />
							</Button>
						) : (
							<Button
								onClick={() =>
									navigate(
										`/${isMovies ? 'movie' : 'tv'}/${type}?page=1`
									)
								}
								variant="ghost"
								color="primary"
								radius="full"
							>
								{defaultLanguage === 'bg-BG' ? 'Виж Повече' : 'View More'}
							</Button>
						)}
					</div>
				</div>
				<div className="grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
					{/* Render the movie or TV show cards */}
					{isMovies
						? (moviesData as mediaType[]).map(
								(movie: mediaType) => (
									<CardComponent
										key={movie.id}
										data={movie as mediaType}
										onOpen={onOpen}
										setMediaId={setMediaId}
										isMovie={isMovies}
									/>
								)
							)
						: (tvData as mediaType[]).map((tvShow: mediaType) => (
								<CardComponent
									key={tvShow.id}
									data={tvShow as mediaType}
									onOpen={onOpen}
									setMediaId={setMediaId}
									isMovie={isMovies}
								/>
							))}
				</div>
			</div>
			{/* Render the ads component */}
			<AdsComponent />
		</div>
	);
};

export default MediaList;
