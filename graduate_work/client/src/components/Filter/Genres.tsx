// import ChipBtn from "./ChipBtn";

import ChipBtn from "./ChipBtn";

// eslint-disable-next-line react-refresh/only-export-components
export const initGenres = [
	{
		id: 28,
		name: "Action",
		bgName: "Екшън",
		is: false,
	},
	{
		id: 10759,
		name: "Action & Adventure",
		bgName: "Екшън и Приключение",
		is: false,
	},
	{
		id: 12,
		name: "Adventure",
		bgName: "Приключение",
		is: false,
	},
	{
		id: 14,
		name: "Fantasy",
		bgName: "Фантастика",
		is: false,
	},
	{
		id: 36,
		name: "History",
		bgName: "Исторически",
		is: false,
	},
	{
		id: 16,
		name: "Animation",
		bgName: "Анимация",
		is: false,
	},
	{
		id: 35,
		name: "Comedy",
		bgName: "Комедия",
		is: false,
	},
	{
		id: 27,
		name: "Horror",
		bgName: "Хорор",
		is: false,
	},
	{
		id: 80,
		name: "Crime",
		bgName: "Криминален",
		is: false,
	},
	{
		id: 99,
		name: "Documentary",
		bgName: "Документарен",
		is: false,
	},
	{
		id: 18,
		name: "Drama",
		bgName: "Драма",
		is: false,
	},
	{
		id: 10751,
		name: "Family",
		bgName: "Семеен",
		is: false,
	},
	{
		id: 10762,
		name: "Kids",
		bgName: "Детски",
		is: false,
	},
	{
		id: 9648,
		name: "Mystery",
		bgName: "Мистерия",
		is: false,
	},
	{
		id: 10763,
		name: "News",
		bgName: "Новини",
		is: false,
	},
	{
		id: 10402,
		name: "Music",
		bgName: "Музика",
		is: false,
	},
	{
		id: 10764,
		name: "Reality",
		bgName: "Реалност",
		is: false,
	},
	{
		id: 10765,
		name: "Sci-Fi & Fantasy",
		bgName: "Фантастика и Фентези",
		is: false,
	},
	{
		id: 10766,
		name: "Soap",
		bgName: "Сапунки",
		is: false,
	},
	{
		id: 10767,
		name: "Talk",
		bgName: "Разговори",
		is: false,
	},
	{
		id: 10768,
		name: "War & Politics",
		bgName: "Война и Политика",
		is: false,
	},
	{
		id: 37,
		name: "Western",
		bgName: "Западен",
		is: false,
	},
];

// eslint-disable-next-line react-refresh/only-export-components

type GenresProps = {
	handleChipClick: (id: number) => void;
	selGenres: Array<{ id: number; name: string; bgName: string; is: boolean }>;
	defaultLanguage: "en-US" | "bg-BG";
};

const Genres = ({
	handleChipClick,
	selGenres,
	defaultLanguage,
}: GenresProps) => {
	return (
		<>
			{selGenres.map((item) => (
				<ChipBtn
					key={item.id}
					value={defaultLanguage === "en-US" ? item.name : item.bgName}
					is={item.is}
					onClick={() => handleChipClick(item.id)}
				/>
			))}
		</>
	);
};

export default Genres;
