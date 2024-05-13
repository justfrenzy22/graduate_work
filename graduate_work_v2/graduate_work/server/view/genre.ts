import { Response } from 'express';

const internalError = (res: Response, lang: 'bg' | 'en') => {
    if (lang === 'bg') {
        return res.json({ status: 404, message: 'Възникна грешка' });
    } else {
        return res.json({ status: 404, message: 'Internal server error' });
    }
};

const none = (res: Response, lang: 'bg' | 'en') => {
    if (lang === 'bg') {
        return res.status(404).json({ status: 404, message: 'Няма резултати' });
    } else {
        return res.status(404).json({ status: 404, message: 'No results' });
    }
};

const success = (res: Response, lang: 'bg' | 'en', type: 'movie' | 'tv') => {

    if (lang === 'bg') {
        return res.status(200).json({ status: 200, message: `${type === 'movie' ? 'Филми' : 'Сериали'} Жанрите са взети успешно` });
    } else {
        return res.status(200).json({ status: 200, message: ` ${type === 'movie' ? 'Movie' : 'TV'} Genres fetched successfully` });
    }

}

export default {
    internalError,
    none,
    success
};
