export interface AuthModalProps {
	isOpen: boolean;
	onOpenChange: (newValue: boolean) => void;
}

export interface SignInTextProps {
	headerText: string;
	inputLabel: string;
	passwordLabel: string;
	descriptionUsr: string;
	descriptionPwd: string;
	SignInButtonText: string;
	notAMemberText: string;
	SignUpLink: string;
	emailErrorMsg: string;
	passwordErrorMsg: string;
}

export interface SignUpProps {
	headerText: string;
	usernameLabel: string;
	emailLabel: string;
	passwordLabel: string;
	confirmPasswordLabel: string;
	descriptionUsername: string;
	descriptionEmail: string;
	SingUpButtonText: string;
	notAMemberText: string;
	SignInLink: string;
	usernameErrorMsg: string;
	emailErrorMsg: string;
	passwordErrorMsg: string;
	confirmPasswordErrorMsg: string;
}

export interface SignInProps {
	onClose: () => void;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	isLogin: boolean;
}

export type NavbarTextTypes = {
	liked: string;
	watched: string;
	system: string;
	dark: string;
	light: string;
	themeText: string;
	bg: string;
	en: string;
	language: string;
	signInBtn: string;
	popularTxt: string;
	trendingTxt: string;
	nowPlayingTxt: string;
	profile: string;
	settings: string;
	helpFeedback: string;
	logOut: string;
	categories: string;
};

export type MenuItemsList = {
	bg: string[];
	en: string[];
};

export interface PopularTextInterface {
	bg: {
		popularTxt: string;
		popularMoviesText: string;
		popularTvSeriesText: string;
	};
	en: {
		popularTxt: string;
		popularMoviesText: string;
		popularTvSeriesText: string;
	};
}

export interface TrendingTextInterface {
	bg: {
		trendingTxt: string;
		trendingMoviesText: string;
		trendingTvSeriesText: string;
	};
	en: {
		trendingTxt: string;
		trendingMoviesText: string;
		trendingTvSeriesText: string;
	};
}

export interface NowPlayingTextInterface {
	bg: {
		nowPlayingTxt: string;
		nowPlayingMoviesText: string;
		nowPlayingTvSeriesText: string;
	};
	en: {
		nowPlayingTxt: string;
		nowPlayingMoviesText: string;
		nowPlayingTvSeriesText: string;
	};
}

export type mediaProps = {
	id: number | undefined;
	title?: string | undefined;
	name?: string | undefined;
	poster_path?: string | undefined;
	release_date?: string | undefined;
	first_air_date?: string | undefined;
	vote_average?: number | undefined;
};

export type mediaModalProps = {
	bg: {
		min: string;
		country: string;
		genre: string;
		closeBtn: string;
		playBtn: string;
	};
	en: {
		min: string;
		country: string;
		genre: string;
		closeBtn: string;
		playBtn: string;
	};
};

export type CardProps = {
	data: mediaProps;
	isMovie: boolean;
};

export type mediaImportProps = {
	title: string;
	buttonText1: string;
	buttonText2: string;
	moviesData: Array<object>;
	tvData: Array<object>;
	handleTVChange: () => void;
	isMovies: boolean;
	setIsMovies: React.Dispatch<React.SetStateAction<boolean>>;
	type: "popular" | "trending" | "now_playing";
};

export type movieType = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: Array<{ id: number; name: string }>;
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

export type mediaType = {
	adult: boolean;
	check: boolean;
	rating: number;
	backdrop_path: string;
	created_by: Array<{
		id: number;
		name: string;
	}>;
	director: string;
	episode_run_time: Array<number>;
	first_air_date: string;
	genres: Array<{
		id: string | number;
		name: string;
	}>;
	homepage: string;
	id: number;
	in_production: boolean;
	name: string;
	networks: Array<{
		id: number;
		name: string;
	}>;
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: Array<{
		iso_3166_1: string;
		name: string;
	}>;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: Array<{
		id: number;
		name: string;
	}>;
	production_countries: Array<{
		iso_3166_1: string;
		name: string;
	}>;
	release_date: string;
	runtime: number;
	seasons: Array<{
		air_date: string;
		episode_count: number;
		id: number;
		name: string;
		overview: string;
		poster_path: string;
		season_number: number;
	}>;
	spoken_languages: Array<{
		english_name: string;
		iso_639_1: string;
		name: string;
	}>;
	status: string;
	type: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	length: number;
	media_type: "movie" | "tv" | "person";
};

export type ResponseType = {
	status: number;
	recommended: Array<mediaType>;
	comments: Array<CommentI>;
	message: string;
	details: mediaType;
	type: string;
	user: {
		email: string;
		username: string;
		_id: string;
		role: "user" | "admin";
		verified: boolean;
		isWatch: boolean;
		color: "green" | "blue" | "red" | "yellow" | "purple";
		isPublic: boolean;
		score: number;
	};
};

export interface CommentI {
	id: string;
  _id: string;
	username: string;
  hasNestedComments: boolean;
	content: string;
	media: "movie" | "tv";
	mediaId: number;
	parentId: number;
	createdAt: string;
}
