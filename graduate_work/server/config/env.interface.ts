export default interface Env {
	PORT: number;
	URL: string;
	JWT_SECRET_KEY: string;
	connString: string;
	movieURL: string;
	tvURL: string;
	searchURL: string;
	basicURL: string;
	discoverURL: string;
	genreMovieURL: string;
	genreTVURL: string;
	countryURL: string;
	accessToken: string;
	bg: `bg-BG`;
	en: `en-US`;
	tv: string;
	movie: string;
	authUser: string;
	authPass: string;
	db: string;
	mailerAPI: string;
	siteAPIKey: string;
}
