import { useContext } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { mediaType } from "../../components/App/props.interface";
import { Pagination } from "@nextui-org/react";
import Loader from "../../components/App/Loader";
import ErrorComponent from "../../components/TV/Error";
import { TVText, TVTextTypes } from "../../components/TV/ErrorText";
import SearchComp from "../../components/App/Search";
import { useNavigate } from "react-router-dom";
import useMediaData from "../../components/App/useMediaData";
import MediaList from "../../components/App/MediaList";
import MediaModal from "../../components/App/MediaModal";




const Trending = () => {
	const { theme, themeStyle, systemTheme, defaultLanguage } =
		useContext<AppContextTypes>(AppContext);
	const navigate = useNavigate();

	const {
		currPage,
		error,
		isLoading,
		isOpen,
		mediaData,
		mediaId,
		onOpen,
		onOpenChange,
		search,
		setCurrPage,
		setMediaId,
		setSearch,
		totalPages,
	} = useMediaData({ type: "trending", isMovie: true });


	const { errorText, backBtn } =
		defaultLanguage === "en-US"
			? (TVText.en as TVTextTypes)
			: (TVText.bg as TVTextTypes);


	if (error !== "") {
		return (
			<ErrorComponent
				errorText={errorText}
				smallText={error}
				backBtn={backBtn}
			/>
		);
	}


	if (isLoading || !mediaData) {
		return <Loader lang={defaultLanguage} />;
	}

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	return (
		<>
			<div
				className={`bg-gradient-to-tl  ${themeStyle[themeKey as keyof typeof themeStyle]} `}
			>
				<div className="flex flex-col items-center py-4 gap-4">
					<SearchComp search={search} setSearch={setSearch} />
					<MediaList
						data={mediaData as mediaType[]}
						onOpen={onOpen as () => void}
						setMediaId={setMediaId as React.Dispatch<React.SetStateAction<number>>}
						title={defaultLanguage === 'bg-BG' ? 'Трендинг Филми' : 'Trending Movie'}
						isMovie
					/>
					<Pagination
						classNames={{
							item: "bg-background/80",
						}}
						total={totalPages < 500 ? totalPages : 500}
						initialPage={currPage}
						onChange={(e) => {
							window.scrollTo({ top: 0, behavior: "smooth" });
							setCurrPage(e);
							navigate(`/movie/trending?page=${e}`);
						}}
					/>
					<MediaModal
						mediaId={mediaId}
						isMoviesMedia={true}
						isOpen={isOpen}
						onOpenChange={onOpenChange as () => void}
					/>
				</div>
			</div>
		</>
	);
};

export default Trending;
