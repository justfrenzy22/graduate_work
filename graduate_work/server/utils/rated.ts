import Rated from "../models/rated"
import { RatedI } from "../models/rated.interface";
import { RequestUserI } from "./user";

export const addRated = async (user: RequestUserI['_id'], mediaId: number, media: `movie` | `tv`, rating: number) => {
    const find = await Rated.findOne({
        user: user,
        mediaId: mediaId,
        media: media
    })

    if (!find) {
        const rated = new Rated({
            user: user,
            mediaId: mediaId,
            media: media,
            rating: rating
        });

        await rated.save();
    }
    else {
        find.rating = rating;
        await find.save();
    }
}

export const loadRated = async (user: RequestUserI, mediaId: number, media: `movie` | `tv`): Promise<RatedI | null | undefined> => {
    const find = await Rated.findOne(
        {
            user: user._id,
            mediaId: mediaId,
            media: media
        }
    )

    console.log(`find`, find);

    return find;
}