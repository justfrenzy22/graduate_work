import { Button, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { mediaType } from "./props.interface";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { useContext } from "react";
import circleCheck from "../../assets/circle-check.svg";
import { Plus, PlusCircle } from "lucide-react";

interface SearchSuggestionsProps {
	data: mediaType[] | [];
	selected: boolean;
	search: string;
	isLoading: boolean;
	handleClicked: (
		mediaId: number,
		mediaType: "movie" | "tv" | "person"
	) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
	data,
	selected,
	search,
	isLoading,
	handleClicked,
}) => {
	const navigate = useNavigate();

	const { theme, systemTheme, defaultLanguage, accessToken, onOpen } =
		useContext<AppContextTypes>(AppContext);

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;
	return (
		<div>
			{data.length > 0 && selected ? (
				<div
					className={`flex flex-col z-50 mt-1 gap-1 absolute py-4 px-2 rounded-2xl ${themeKey === "dark" ? "bg-[#00022A]" : "bg-[#ECECEC]"} w-[95vw] sm:w-[50vw] max-h-[520px] overflow-x-auto`}
				>
					{data.map((item: mediaType, idx: number) => (
						<div key={idx}>
							{item.media_type === "movie" || item.media_type === "tv" ? (
								<div
									key={item.id}
									onClick={() =>
										isLoading
											? null
											: navigate(
													`/${item.media_type === "movie" ? "movie" : "tv"}/${item.id}${item.media_type === "tv" ? `/1/1` : ""}`
												)
									}
									className="flex flex-row justify-between gap-2 hover:bg-[#452fde]/15 hover:text-white rounded-md cursor-pointer p-2"
								>
									<div className="flex flex-row gap-2 items-center justify-center">
										<Image
											width={30}
											radius="md"
											src={`https://www.themoviedb.org/t/p/w94_and_h141_bestv2/${item.poster_path}`}
										/>
										<div>
											<h1>{item.title || item.name}</h1>
											<div className="flex flex-row gap-1">
												<p>{item.release_date || item.first_air_date}</p>
												<p>
													{item.media_type === "movie"
														? defaultLanguage === "bg-BG"
															? "филм"
															: "movie"
														: defaultLanguage === "bg-BG"
															? "сериал"
															: "tv show"}
												</p>
											</div>
										</div>
									</div>
									<div className="flex flex-row items-center justify-center text-white">
										<Button
											isDisabled={isLoading}
											isLoading={isLoading}
											onPress={() => {
												if (accessToken) {
													handleClicked(item.id, item.media_type);
												} else {
													onOpen();
												}
											}}

											isIconOnly
											radius="full"
											className=" bg-transparent  hover:bg-[#452fde]/30 "
										>
											{item.check ? (
												<Image src={circleCheck} width={20} />
											) : (
												<PlusCircle size={20} color={"white"} />
											)}
										</Button>
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
					))}
					<div className="flex justify-center items-center">
						<Button
							color="primary"
							variant="shadow"
							onClick={() =>
								navigate(
									`/filter?keyword=${search.split(" ").join("+")}&sort=popularity&type=multi`
								)
							}
							radius="full"
							className="w-[95%]"
							endContent={<Plus size={20} color={"white"} />}
						>
							{defaultLanguage === "bg-BG"
								? "Виж Всички Резултати"
								: "View All Results"}
						</Button>
					</div>
				</div>
			) : (
				<>
					{isLoading ? (
						<>loading...</>
					) : (
						<div>{selected && search.length > 3 && `no data`}</div>
					)}
				</>
			)}
		</div>
	);
};

export default SearchSuggestions;
