import React, {
	useContext,
	useEffect,
	useState,
} from 'react';
import ResponsiveEmbed from 'react-responsive-embed';
import { Button, Tooltip } from '@nextui-org/react';
import { AppContext, AppContextTypes } from '../../utils/AppContext';

export type FirstSectionType = {
	movieId: string | undefined;
	server:
		| 'https://vidsrc.to/embed/movie/'
		| 'https://vidsrc.me/embed/movie/'
		| 'https://www.2embed.cc/embed/';
	setServer: React.Dispatch<
		React.SetStateAction<
			| 'https://vidsrc.to/embed/movie/'
			| 'https://vidsrc.me/embed/movie/'
			| 'https://www.2embed.cc/embed/'
		>
	>;
	possibleServers: Array<{ label: string; value: string }>;
	handleServerChange: (server: FirstSectionType['server']) => void;
};

const FirstSection: React.FC<FirstSectionType> = ({
	movieId,
	server,
	possibleServers,
	handleServerChange,
}): JSX.Element => {
	const [link, setLink] = useState<string>('');
	const { defaultLanguage, isMobile } = useContext<AppContextTypes>(AppContext);
	const { title, infoText }: { title: string; infoText: string } =
		defaultLanguage === 'en-US' ? FirstSectionText.en : FirstSectionText.bg;

	useEffect(() => {
		if (server === 'https://vidsrc.to/embed/movie/') {
			setLink(`${server}${movieId}`);
		} else if (server === 'https://vidsrc.me/embed/movie/') {
			setLink(`${server}${movieId}`);
		} else if (server === 'https://www.2embed.cc/embed/') {
			setLink(`${server}${movieId}`);
		}
	}, [link, server, movieId]);

	

	

	return (
		<>
			<div className={`flex flex-col md:flex-row  gap-3 w-full ${isMobile ? 'flex-col' : ''}`} >
				{/* fist section */}
				<div className="w-full">
					{/* <iframe
						src={`${server}${movieId}`}
						ref={iframeRef}
					></iframe> */}
					
					<ResponsiveEmbed
						className="rounded-lg"
						src={`${server}${movieId}`}
						allowFullScreen
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					/>
				</div>
				<div className="bg-background/40 dark:bg-default/40 rounded-xl flex flex-col gap-3 p-4">
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
	} as { title: string; infoText: string },
	en: {
		title: 'Servers',
		infoText: "If current server doesn't work please try other servers.",
	} as { title: string; infoText: string },
};
