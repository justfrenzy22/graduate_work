import React, { useContext, useEffect, useState } from 'react';
import ResponsiveEmbed from 'react-responsive-embed';
import {
	Button,
	ScrollShadow,
	Select,
	SelectItem,
	Tooltip,
} from '@nextui-org/react';
import { mediaType } from '../App/props.interface';
import Loader from '../App/Loader';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import { useNavigate } from 'react-router-dom';

export type FirstSectionType = {
	tvId: string | undefined;
	server:
		| 'https://vidsrc.to/embed/tv/'
		| 'https://vidsrc.me/embed/tv?tmdb='
		| 'https://www.2embed.cc/embedtv/';
	setServer: React.Dispatch<
		React.SetStateAction<
			| 'https://vidsrc.to/embed/tv/'
			| 'https://vidsrc.me/embed/tv?tmdb='
			| 'https://www.2embed.cc/embedtv/'
		>
	>;
	season: string | undefined;
	episode: string | undefined;
	tvDetails: mediaType;
	possibleServers: Array<{ label: string; value: string }>;
	handleServerChange: (
		server:
			| 'https://vidsrc.to/embed/tv/'
			| 'https://vidsrc.me/embed/tv?tmdb='
			| 'https://www.2embed.cc/embedtv/'
	) => void;
};

const FirstSection: React.FC<FirstSectionType> = ({
	tvId,
	server,
	season,
	episode,
	tvDetails,
	possibleServers,
	handleServerChange,
}): JSX.Element => {
	const [link, setLink] = useState('');
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	const {
		title,
		infoText,
		seasonTxt,
		episodeTxt,
	}: {
		title: string;
		infoText: string;
		seasonTxt: string;
		episodeTxt: string;
	} = defaultLanguage === 'en-US' ? FirstSectionText.en : FirstSectionText.bg;
	const navigate = useNavigate();
	const [actualSeason, setActualSeason] = useState(season);
	useEffect(() => {
		if (server === 'https://vidsrc.to/embed/tv/') {
			setLink(`${server}${tvId}/${season}/${episode}`);
		} else if (server === 'https://vidsrc.me/embed/tv?tmdb=') {
			setLink(`${server}${tvId}&season=${season}&episode=${episode}`);
		} else if (server === 'https://www.2embed.cc/embedtv/') {
			setLink(`${server}${tvId}?s=${season}&e=${episode}`);
		}
	}, [link, server, tvId, season, episode]);

	const handleChangeSeason = (newSeason: string) => {
		// Update the URL when the season changes
		setActualSeason(newSeason);
		// window.scrollTo({
		// 	top: 0,
		// 	behavior: "smooth",
		// });
		const newUrl = `/tv/${tvId}/${Number(newSeason)}/1`; // Adjust the URL structure according to your needs
		navigate(newUrl);
	};

	const handleChangeEpisode = (newEpisode: string) => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		const newUrl = `/tv/${tvId}/${season}/${newEpisode}`;
		navigate(newUrl);
	};

	return (
		<>
			<div className="flex flex-col md:flex-row gap-3 w-full">
				{/* fist section */}
				<div className="w-full">
					{(server as FirstSectionType['server']) ? (
						<ResponsiveEmbed
							className="rounded-lg"
							src={link}
							allowFullScreen
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						/>
					) : (
						<Loader lang={defaultLanguage} />
					)}
				</div>
				<div className="bg-background/40 dark:bg-default/40 rounded-xl flex flex-col gap-3 sm:py-[20px] p-4">
					<h1 className="text-3xl text-center font-semibold">
						{title}
					</h1>
					<p className="text-center opacity-50">{infoText}</p>
					<div className="flex flex-row justify-center gap-2 px-2 py-2">
						{possibleServers.map((serv, idx) => (
							<Tooltip
								key={idx}
								showArrow
								shadow="lg"
								className="bg-background/90"
								content={serv.label}
							>
								<Button
									color="primary"
									radius="full"
									variant={
										server === serv.value
											? 'shadow'
											: 'bordered'
									}
									onPress={() =>
										handleServerChange(
											serv.value as FirstSectionType['server']
										)
									}
								>
									{serv.label}
								</Button>
							</Tooltip>
						))}
					</div>
					<div className="flex justify-center ">
						<Select
							items={tvDetails?.seasons}
							listboxProps={{
								itemClasses: {
									base: [
										'rounded-md',
										'text-default-500',
										'transition-opacity',
										'data-[hover=true]:text-foreground',
										'data-[hover=true]:bg-default-50',
										'dark:data-[hover=true]:bg-default-50',
										'data-[selectable=true]:focus:bg-default-50',
										'data-[pressed=true]:opacity-70',
										'data-[focus-visible=true]:ring-default-500',
									],
								},
							}}
							popoverProps={{
								classNames: {
									base: 'before:bg-default/60',
									content:
										'p-0 border-small bg-background/90 ',
								},
							}}
							selectionMode="single"
							label={`${seasonTxt}` + ` ${actualSeason}`}
							onChange={(e) => handleChangeSeason(e.target.value)}
						>
							{/* value={actualSeason} */}
							{tvDetails?.seasons?.map((seas) => (
								<SelectItem
									onPress={() =>
										handleChangeSeason(
											seas.season_number.toString()
										)
									}
									key={seas.season_number}
									value={seas.season_number}
								>
									{seasonTxt} {seas.season_number}
								</SelectItem>
							))}
						</Select>
					</div>
					<ScrollShadow className=" overflow-y-auto w-full flex-col max-h-[510px] ">
						{tvDetails &&
							tvDetails.seasons &&
							season &&
							Array.from({
								length: tvDetails?.seasons[Number(season) - 1]
									.episode_count,
							}).map((_, idx: number) => (
								<div key={idx}>
									{tvDetails?.seasons[Number(season) - 1]
										.episode_count !== 0 ? (
										<div
											className="flex justify-center mt-2 w-full"
											key={idx + 1}
										>
											<Tooltip
												placement="bottom"
												className="w-full"
												showArrow
												classNames={{
													base: 'bg-transparent',
													content:
														'bg-background/80 dark:bg-background/80',
												}}
												content={
													tvDetails?.seasons[
														Number(season) - 1
													].air_date
												}
											>
												<Button
													className="w-[90%]"
													color="primary"
													radius="full"
													size="sm"
													onPress={() =>
														handleChangeEpisode(
															(idx + 1).toString()
														)
													}
													variant={
														episode ===
														(idx + 1).toString()
															? 'shadow'
															: 'bordered'
													}
												>
													{episodeTxt} {idx + 1}
												</Button>
											</Tooltip>
										</div>
									) : (
										<p>asdsadsa</p>
									)}
								</div>
							))}
					</ScrollShadow>
				</div>
			</div>
		</>
	);
};

export default FirstSection;

const FirstSectionText = {
	bg: {
		title: 'Сървъри',
		infoText: 'Ако текущият сървър не работи, моля изберете друг сървър.',
		seasonTxt: 'Сезон',
		episodeTxt: 'Епизод',
	} as {
		title: string;
		infoText: string;
		seasonTxt: string;
		episodeTxt: string;
	},
	en: {
		title: 'Servers',
		infoText: "If current server doesn't work please try other servers.",
		seasonTxt: 'Season',
		episodeTxt: 'Episode',
	} as {
		title: string;
		infoText: string;
		seasonTxt: string;
		episodeTxt: string;
	},
};
