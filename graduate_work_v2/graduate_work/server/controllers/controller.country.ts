import { Request, Response } from "express";
import Country from "../models/country";
import CountryI from "../models/country.interface";
import handle from "../view/country";

const findCountry = async (req: Request, res: Response) => {
	const { lang } = req.query as unknown as { lang: "bg-BG" | "en-US" };
	try {
		const { keyword } = req.query as unknown as { keyword: string };

		const countries = (await Country.aggregate([
			{
				$match: {
					english_name: { $regex: new RegExp(keyword, "i") },
				},
			},
		])) as CountryI[] | null;

		if (!countries) {
			return handle.none(res, lang);
		}
		return handle.success(res, lang, countries);
	} catch (err) {
		console.error(err);
		return handle.internalError(res, lang);
	}
};

const countryPagination = async (req: Request, res: Response) => {
	const { lang, offset, limit } = req.query as unknown as {
		lang: "bg-BG" | "en-US";
		offset: number;
		limit: number;
	};

	const countries = await Country.aggregate([
		{ $skip: offset },
		{ $limit: limit },
	]);

	if (!countries) {
		return handle.none(res, lang);
	}
	return handle.success(res, lang, countries);
};

export default { findCountry, countryPagination };
