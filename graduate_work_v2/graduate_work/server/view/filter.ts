import { Response } from "express";
import { MediaI } from "../utils/filter";

const internalError = (res: Response, lang: "bg-BG" | "en-US") => {
	console.log(`internalError`);
	if (lang === "bg-BG") {
		return res.json({ status: 404, message: "Възникна грешка" });
	} else {
		return res.json({ status: 404, message: "Internal server error" });
	}
};

const notFound = (res: Response, lang: "bg-BG" | "en-US") => {
	console.log(`aah`);
	if (lang === "bg-BG") {
		return res.status(404).json({ status: 404, message: "Няма резултати" });
	} else {
		return res.status(404).json({ status: 404, message: "No results" });
	}
};

const success = (res: Response, media: MediaI[]) => {
	return res.status(200).json({
		status: 200,
		message: `Results Found`,
		media: media,
	});
};

const successKeywordFilter = (res: Response, media: MediaI[], nextPage: number) => {
	return res.status(200).json({
		status: 200,
		message: `Successfully fetched results`,
		media: media,
		nextPage: nextPage,
	})
}

export default {
	internalError,
	notFound,
	success,
	successKeywordFilter,
};
