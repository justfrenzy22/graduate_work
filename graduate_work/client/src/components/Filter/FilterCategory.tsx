import {
	Accordion,
	AccordionItem,
	Button,
	Input,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { useContext, useState } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import { DateValue } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
import { I18nProvider } from "@react-aria/i18n";
import Genres, { initGenres } from "./Genres";
import { countryInit } from "./asd";
import { Check } from "lucide-react";

const FilterCategory = () => {
	const { defaultLanguage, isMobile } = useContext<AppContextTypes>(AppContext);
	const [type, setType] = useState<string>("multi");
	const [sort, setSort] = useState<string>("popularity");
	const [keyword, setKeyword] = useState<string>("");
	const [genres, setGenres] = useState(initGenres);
	const [country, setCountry] = useState(countryInit);

	const [date, setDate] = useState<RangeValue<DateValue>>({
		start: "" as unknown as DateValue,
		end: "" as unknown as DateValue,
	});

	const handleFilter = () => {
		const baseUrl = "https://crackflix.site/filter"; // Replace 'yourwebsite.com' with your actual website domain
		const URLa = new URL(baseUrl);

		if (keyword !== "" && keyword.length > 3) {
			URLa.searchParams.append("keyword", keyword);
		}

		if (sort !== "") {
			URLa.searchParams.append("sort", sort);
		}

		if (type !== "") {
			URLa.searchParams.append("type", type);
		}

		const selectedGenres = genres
			.filter((genre) => genre.is)
			.map((genre) => genre.id);
		if (selectedGenres.length > 0) {
			URLa.searchParams.append("genres", selectedGenres.join(","));
		}

		const selectedCountries = country
			.filter((country) => country.is)
			.map((country) => country.iso_3166_1);
		if (selectedCountries.length > 0) {
			URLa.searchParams.append("countries", selectedCountries.join(","));
		}

		if (date.start !== ("" as unknown as DateValue)) {
			URLa.searchParams.append("beforeYear", `${date.start}`);
		}

		if (date.end !== ("" as unknown as DateValue)) {
			URLa.searchParams.append("afterYear", `${date.end}`);
		}

		window.location.href = URLa.toString();
	};

	return (
		// <div className="flex flex-col sm:w-[800px] w-[95vw]  p-8 gap-[30px] sm:bg-background/40 bg-background/40 dark:bg-default/40 rounded-xl">
		<div className="flex flex-col sm:w-[80%] w-[95vw] p-8 gap-[30px] sm:bg-background/40 bg-background/40 dark:bg-default/40 rounded-xl ">
			<div className="flex flex-row justify-between w-full gap-4">
				<h1>Filter</h1>
				<Select
					required
					value={sort}
					defaultSelectedKeys={["popularity"]}
					color="default"
					// `popularity` | `vote_average` | `title` | `release_date`
					className="max-w-[300px]"
					onChange={(e) => setSort(e.target.value)}
					variant="bordered"
					label={defaultLanguage === "en-US" ? "Sort" : "Сортирай"}
				>
					<SelectItem key={"popularity"} value="popularity">
						{defaultLanguage === "en-US" ? "Popularity" : "Популярност"}
					</SelectItem>
					<SelectItem key={"vote_average"} value="vote_average">
						{defaultLanguage === "en-US"
							? "Vote Average"
							: "Големина на оценка"}
					</SelectItem>
					<SelectItem key={"title"} value="title">
						{defaultLanguage === "en-US" ? "Alphabetic" : "Азбучно"}
					</SelectItem>
					<SelectItem key={"release_date"} value="release_date">
						{defaultLanguage === "en-US" ? "Release Date" : "Дата на издаване"}
					</SelectItem>
				</Select>
			</div>
			{/* input */}
			<div className="flex flex-col sm:flex-row gap-1">
				<Input
					isRequired
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					label={defaultLanguage === "en-US" ? "Search" : "Търси"}
					variant="bordered"
					color="default"
					isClearable
					onClear={() => setKeyword("")}
				/>
				<Select
					required
					value={type}
					defaultSelectedKeys={["multi"]}
					color="default"
					onChange={(e) => setType(e.target.value)}
					variant="bordered"
					label={defaultLanguage === "en-US" ? "Type" : "Тип"}
				>
					<SelectItem key={"multi"} value="multi">
						{defaultLanguage === "en-US" ? "Multi" : "Всички"}
					</SelectItem>
					<SelectItem key={"movie"} value="movie">
						{defaultLanguage === "en-US" ? "Movies" : "Филми"}
					</SelectItem>
					<SelectItem key={"tv"} value="tv">
						{defaultLanguage === "en-US" ? "TV Series" : "Сериали"}
					</SelectItem>
				</Select>
				<I18nProvider locale={defaultLanguage}>
					<DateRangePicker
						variant="bordered"
						onChange={setDate}
						color="default"
						label={defaultLanguage === "en-US" ? "Pick a date" : "Избери дата"}
						visibleMonths={isMobile ? 1 : 3}
						pageBehavior="single"
					/>
				</I18nProvider>
			</div>
			<Accordion variant="bordered" className="w-full">
				<AccordionItem
					title={`Genres ${genres.filter((g) => g.is).length > 0 ? `${genres.filter((g) => g.is).length}` : ""} `}
				>
					<div className="flex gap-1 flex-wrap max-w-full">
						<Genres
							defaultLanguage={defaultLanguage}
							selGenres={genres}
							handleChipClick={(chipId) => {
								setGenres((prevGenres) =>
									prevGenres.map((genre) =>
										genre.id === chipId ? { ...genre, is: !genre.is } : genre
									)
								);
							}}
						/>
					</div>
				</AccordionItem>
				<AccordionItem
					title={`Country ${country.filter((c) => c.is).length > 0 ? `${country.filter((c) => c.is).length}` : ""} `}
				>
					<div className="flex flex-row flex-wrap w-full gap-1">
						{country.map((c) => (
							<Button
								size="sm"
								radius="full"
								onPress={() =>
									setCountry((prev) =>
										prev.map((e) =>
											e.iso_3166_1 === c.iso_3166_1 ? { ...e, is: !e.is } : e
										)
									)
								}
								startContent={c.is ? <Check size={14} /> : null}
								color={c.is ? "primary" : "default"}
								variant={c.is ? "shadow" : "faded"}
								className="cursor-pointer"
							>
								{defaultLanguage === "en-US" ? c.english_name : c.native_name}
							</Button>
						))}
					</div>
				</AccordionItem>
			</Accordion>
			<div className="flex justify-center items-center">
				<Button
					color="primary"
					onPress={handleFilter}
					variant="shadow"
					radius="lg"
					className="sm:w-[400px] w-full "
				>
					Filter
				</Button>
			</div>
		</div>
	);
};

export default FilterCategory;
