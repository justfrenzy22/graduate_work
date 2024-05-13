import { Request, Response } from 'express';
import Country from '../models/country';
import Env from '../config/env.interface';
import env from '../config/env';
import fetch from 'node-fetch';
import handle from '../view/country';


const update = async (req: Request, res: Response) => {

    const { accessToken, countryURL } = env as Env;

    const { lang } = req.query as unknown as {
        lang: 'bg-BG' | 'en-US',
    };

    try {
        const response = await fetch(`${countryURL}?language=${lang}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((resp) => resp.json())
            .catch((err) => console.error(err));

        if (response.length <= 0) {
            return handle.none(res, lang);
        }

        await Country.insertMany(response);

        return handle.success(res, lang);
    } catch (err) {
        return handle.internalError(res, lang);
    }
}