import { Response } from "express";
import { RequestI } from "../middleware/authNext";
import { addRated } from "../utils/rated";
import { RequestUserI } from "../utils/user";

const addRate = (req: RequestI, res: Response) => {
    const { mediaId, media, rating, lang } = req.query as {
        mediaId: string;
        media: `movie` | `tv`;
        rating: string;
        lang: `bg-BG` | `en-US`;
    };

    addRated(req.user?._id as RequestUserI['_id'], Number(mediaId), media as `movie` | `tv`, Number(rating));

    return res.status(200).json({ status: 200, message: lang === `bg-BG` ? `Оценено успешно` : `Rated successfully` });
}



export default {
    addRate,
};