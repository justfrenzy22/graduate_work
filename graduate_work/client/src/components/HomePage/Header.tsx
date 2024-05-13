import React, { useContext } from 'react';
import HeaderText from './HeaderText';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import {
	HomePageContext,
	HomePageContextTypes,
} from '../../utils/HomePageContext';
import MediaModal from '../App/MediaModal';
import Search from '../App/Search';

const Header = () => {
	const [search, setSearch] = React.useState<string>('');
	const { defaultLanguage } = React.useContext<AppContextTypes>(AppContext);
	const { isMoviesMedia, isOpen, mediaId, onOpenChange } =
		useContext<HomePageContextTypes>(HomePageContext);
	const {
		welcomeText,
		firstParagraph,
		secondParagraph,
		thirdParagraph,
		// inputPlaceholder,
		// filterBtnTxt,
	}: {
		welcomeText: string;
		firstParagraph: string;
		secondParagraph: string;
		thirdParagraph: string;
		inputPlaceholder: string;
		filterBtnTxt: string;
	} = defaultLanguage === 'en-US' ? HeaderText.en : HeaderText.bg;

	const { error } = useContext<HomePageContextTypes>(HomePageContext);

	if (error !== '' && typeof error === 'string') {
		return <></>;
	}

	return (
		<>
			<div className=" h-[93.5vh] w-auto grid place-items-center">
				{/* flex justify-center items-center //// mx-auto*/}
				<div className="  lg:py-16 lg:px-6 flex justify-center text-center">
					<div className=" sm:text-lg flex flex-col gap-4">
						{/* max-w-screen-xl//max-w-screen-lg */}
						<div>
							<h1 className="mb-2 text-5xl tracking-tight font-bold ">
								{welcomeText}
							</h1>
							<p className=" font-light">{firstParagraph}</p>
							<p className=" font-light">{secondParagraph}</p>
							<p className="mb-4 font-light">{thirdParagraph}</p>
						</div>
						<div className="flex items-center justify-center">
							<Search
								search={search}
								setSearch={setSearch}
							/>
						</div>
					</div>
				</div>
				<MediaModal
					isMoviesMedia={isMoviesMedia}
					isOpen={isOpen}
					mediaId={mediaId}
					onOpenChange={onOpenChange}
				/>
			</div>
		</>
	);
};

export default Header;
