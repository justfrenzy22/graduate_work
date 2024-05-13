export const MovieText = {
	bg: {
		errorText: "Грешка 404",
		smallText:
			"Този филм не е добавен в сървърите. Може да се навигирате назад, за да намерите други филми.",
		backBtn: "Назад",
	} as MovieTextTypes,
	en: {
		errorText: "Error 404",
		smallText:
			"This movie has not yet been added to the servers. You can navigate back to look for other movies.",
		backBtn: "Back",
	} as MovieTextTypes,
};

export type MovieTextTypes = {
	errorText: string;
	smallText: string;
	backBtn: string;
};
