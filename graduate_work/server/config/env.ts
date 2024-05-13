import Env from "./env.interface";

const env = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8000,
    URL: process.env.URL ? process.env.URL : '192.168.0.101',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    connString: process.env.connString,
    movieURL: process.env.movieURL,
    tvURL : process.env.tvURL,
    searchURL: process.env.searchURL,
    basicURL: process.env.basicURL,
    discoverURL: process.env.discoverURL,
    genreMovieURL: process.env.genreMovieURL,
    genreTVURL: process.env.genreTVURL,
    countryURL: process.env.countryURL,
    accessToken: process.env.accessToken,
    bg: process.env.bg,
    en: process.env.en,
    tv: process.env.tv,
    movie: process.env.movie,
    authUser: process.env.authUser,
    authPass: process.env.authPass,
    db: process.env.db,
    mailerAPI: process.env.mailerAPI,
    siteAPIKey: process.env.siteAPIKey,
} as Env;

export default env;