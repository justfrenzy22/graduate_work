import { useDisclosure } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextTypes } from "../utils/AppContext";
import SearchComp from "../components/App/Search";
import { mediaType } from "../components/App/props.interface";
import MediaList from "../components/Filter/MediaList";
import MediaModal from "../components/App/MediaModal";
import Loader from "../components/App/Loader";
import FilterCategory from "../components/Filter/FilterCategory";
import { Discover } from "../components/App/handleFunctions";

const Filter = () => {
	const { defaultLanguage, themeStyle, theme, systemTheme } =
		useContext<AppContextTypes>(AppContext);

	const queryParams = new URLSearchParams(window.location.search);
	const keyword = queryParams.get("keyword") as string;
	const genres = queryParams.get("genres") as string;
	const type = queryParams.get("type") as string;
	const beforeYear = queryParams.get("beforeYear") as string;
	const afterYear = queryParams.get("afterYear") as string;
	const sort = queryParams.get("sort") as string;
	const page = queryParams.get("page") || "1";
	const country = queryParams.get("country") as string;
	const [mediaData, setMediaData] = useState<mediaType[]>([] as mediaType[]);
	const [mediaId, setMediaId] = useState<number>(0);
	// const [currPage, setCurrPage] = useState<number>(page ? Number(page) : 1);
	const [search, setSearch] = useState<string>("");
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isMovieMedia, setMovieMedia] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	useEffect(() => {
		setLoading(true);
		const func = async () => {
			const response = await Discover(
				defaultLanguage,
				keyword,
				type,
				genres,
				beforeYear,
				afterYear,
				sort,
				page,
				country
			);

			if (response.status === 200) {
				setMediaData(response.media);
			}
		};
		func();

		setLoading(false);
	}, [
		defaultLanguage,
		keyword,
		genres,
		beforeYear,
		afterYear,
		sort,
		page,
		country,
		type,
	]);

	// const goNextPage = (e: number) => {
	// 	const nextPage = e;
	// 	queryParams.set("page", nextPage.toString());
	// 	const newQueryString = queryParams.toString();
	// 	setCurrPage(nextPage);
	// 	navigate(`/filter?${newQueryString}`);
	// };

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	if (isLoading) {
		return <Loader lang={defaultLanguage} />;
	}

	return (
		<>
			<div
				className={`bg-gradient-to-tl  ${themeStyle[themeKey as keyof typeof themeStyle]} `}
			>
				<div className="flex flex-col items-center py-4 gap-4">
					<SearchComp search={search} setSearch={setSearch} />
					<FilterCategory />
					<>
						{mediaData.length > 0 ? (
							<>
								<MediaList
									data={mediaData as mediaType[]}
									onOpen={onOpen as () => void}
									setMediaId={
										setMediaId as React.Dispatch<React.SetStateAction<number>>
									}
									setMovieMedia={
										setMovieMedia as React.Dispatch<
											React.SetStateAction<boolean>
										>
									}
									title={decodeURIComponent(keyword)}
								/>
							</>
						) : (
							<>No results found</>
						)}
					</>
					<MediaModal
						mediaId={mediaId}
						isMoviesMedia={isMovieMedia}
						isOpen={isOpen}
						onOpenChange={onOpenChange as () => void}
					/>
				</div>
			</div>
		</>
	);
};

export default Filter;
