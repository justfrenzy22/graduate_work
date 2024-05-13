import { Request, Response } from 'express';
import GenreMovie from '../models/genreMovie';
import GenreTV from '../models/genreTV';
import Env from '../config/env.interface';
import env from '../config/env';
import fetch from 'node-fetch';
import handle from '../view/genre';
import GenreInterface from '../models/genre.interface';


const updateMovie = async (req: Request, res: Response) => {
    const { accessToken, genreMovieURL } = env as Env;

    const { lang } = req.query as unknown as {
        lang: 'bg' | 'en';
    };

    try {
        const responseBG : { genres: GenreInterface[], length: number } = await fetch(`${genreMovieURL}?language=bg`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .catch((err) => console.error(err));
        const responseEN : { genres: GenreInterface[], length: number } = await fetch(`${genreMovieURL}?language=en`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .catch((err) => console.error(err));

        if (responseBG?.genres?.length <= 0 || responseEN.genres?.length <= 0) {
            return handle.none(res, lang);
        }

        for (let i = 0; i < responseBG.length; i++) {
            const oneGenre = new GenreMovie({
                id: Number(responseBG.genres[i].id),
                name: String(responseBG.genres[i].name),
                english_name: String(responseEN.genres[i].name),
            })

            await oneGenre.save();
        }

        return handle.success(res, lang, 'movie');
    } catch (err) {
        return handle.internalError(res, lang);
    }


}

const updateTV = async (req: Request, res: Response) => {
    const { accessToken, genreTVURL } = env as Env;

    const { lang } = req.query as unknown as {
        lang: 'bg' | 'en';
    };

    try {
        const responseBG : { genres: GenreInterface[], length: number } = await fetch(`${genreTVURL}?language=bg`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .catch((err) => console.error(err));
        const responseEN : { genres: GenreInterface[], length: number } = await fetch(`${genreTVURL}?language=en`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .catch((err) => console.error(err));


        if (responseBG?.genres?.length <= 0 || responseEN.genres?.length <= 0) {
            return handle.none(res, lang);
        }

        for (let i = 0; i < responseBG.length; i++) {
            const oneGenre = new GenreTV({
                id: Number(responseBG.genres[i].id),
                name: String(responseBG.genres[i].name),
                english_name: String(responseEN.genres[i].name),
            })

            await oneGenre.save();
        }

        return handle.success(res, lang, 'tv');
    } catch (err) {
        return handle.internalError(res, lang);
    }
}


export default {
    updateMovie,
    updateTV,
};