import { Response } from "express";
import CountryI from "../models/country.interface";

const internalError = (res: Response, lang: "bg-BG" | "en-US") => {
	console.log(`internalError`);
	if (lang === "bg-BG") {
		return res.json({ status: 404, message: "Възникна грешка" });
	} else {
		return res.json({ status: 404, message: "Internal server error" });
	}
};

const none = (res: Response, lang: "bg-BG" | "en-US") => {
	if (lang === "bg-BG") {
		return res.status(404).json({ status: 404, message: "Няма резултати" });
	} else {
		return res.status(404).json({ status: 404, message: "No results" });
	}
};

const success = (
	res: Response,
	lang: "bg-BG" | "en-US",
	countries: CountryI[]
) => {
	if (lang === "bg-BG") {
		return res
			.status(200)
			.json({
				status: 200,
				message: `Държавите са взети успешно`,
				countries: countries,
			});
	} else {
		return res
			.status(200)
			.json({
				status: 200,
				message: ` Countries fetched successfully`,
				countries: countries,
			});
	}
};

export default {
	internalError,
	none,
	success,
};
