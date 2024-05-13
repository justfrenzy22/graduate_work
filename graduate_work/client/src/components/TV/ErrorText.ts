export const TVText = {
	bg: {
		errorText: "Грешка 404",
		smallText:
			"Този сериал не е добавен в сървърите. Може да се навигирате назад, за да намерите други сериали.",
		backBtn: "Назад",
	} as TVTextTypes,
	en: {
		errorText: "Error 404",
		smallText:
			"This tv show has not yet been added to the servers. You can navigate back to look for other tv shows.",
		backBtn: "Back",
	} as TVTextTypes,
};

export type TVTextTypes = {
	errorText: string;
	smallText: string;
	backBtn: string;
};
