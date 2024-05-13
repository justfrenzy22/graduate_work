import { lazy, useContext, useEffect, useState } from "react";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
// import MediaModal from "../App/MediaModal";
const MediaModal = lazy(() => import("../App/MediaModal"));
import { DeleteLiked, GetLiked } from "../App/handleFunctions";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { mediaType } from "../App/props.interface";
import Loader from "../App/Loader";
import AdsComponent from "../HomePage/AdsComponent";
import CardComponent from "../Filter/CardComponent";
import toast from "react-hot-toast";

const Liked = () => {
	const { defaultLanguage, theme, systemTheme } =
		useContext<AppContextTypes>(AppContext);

	const [mediaData, setMediaData] = useState<mediaType[]>();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [mediaId, setMediaId] = useState<number>(0);
	const [isMovieMedia, setMovieMedia] = useState(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isOpenToolTip, setOpenToolTip] = useState<boolean>(false);
	const [noResultsMessage, setNoResultsMessage] = useState<string>("");

	useEffect(() => {
		const func = async () => {
			setLoading(true);
			const response = await GetLiked(defaultLanguage);
			if (response.status == 200) {
				if (response.media.length > 0) {
					response.media.map(
						(e: mediaType) => (e.vote_average = Number(e.vote_average))
					);
				} else {
					setNoResultsMessage(response.message);
				}
				setMediaData(response.media);
			}
			setLoading(false);
		};
		func();
	}, [defaultLanguage]);

	const deleteAll = async () => {
		const response = await DeleteLiked(defaultLanguage);
		if (response.status == 200) {
			setMediaData([]);
			const themeKey: AppContextTypes["theme"] =
				theme === "system" ? (systemTheme ? "dark" : "light") : theme;
			toast.success(`${response.message}`, {
				style: {
					background: `${themeKey ? "#2a2a2a5d" : "#ffffffe9"} `,
					borderRadius: "30px",
					color: `${themeKey === `dark` ? "#fff" : "#fff"}`,
				},
				iconTheme: {
					primary: `#452fde`,
					secondary: `#fff`,
				},
			});
			setOpenToolTip(false);
		}
	};

	if (isLoading || !mediaData) {
		return <Loader lang={defaultLanguage} />;
	}

	return (
		<div className=" w-full flex flex-col justify-center items-center sm:px-4 px-0">
			<div className="flex w-full justify-between p-4 gap-2">
				<h1 className="text-4xl font-bold">
					{defaultLanguage === "en-US" ? "Liked:" : "Харесвани:"}
				</h1>
				{mediaData.length > 0 && (
					<Tooltip
						isOpen={isOpenToolTip}
						content={
							<div className="flex flex-col w-full gap-1 p-1 justify-center items-center">
								<p className="text-xl font-bold">
									{defaultLanguage === "en-US" ? "Delete All" : "Изтрий всички"}
								</p>
								<p className="w-[60%] text-center">
									{defaultLanguage === "en-US"
										? "Are you sure? If you delete all, it will be gone forever"
										: "Сигурни ли сте? Ако изтриете всички, ще бъде изтрити завинаги"}
								</p>
								<div className="flex flex-row justify-center gap-4">
									<Button
										onClick={() => setOpenToolTip(false)}
										color="danger"
										variant="light"
										// className="max-w-[100px]"
										radius="full"
									>
										{defaultLanguage === "en-US" ? "Close" : "Затвори"}
									</Button>
									<Button
										color="primary"
										radius="full"
										variant="shadow"
										onClick={deleteAll}
									>
										{defaultLanguage === "en-US"
											? "Delete All"
											: "Изтрий всички"}
									</Button>
								</div>
							</div>
						}
					>
						<Button
							onClick={() => setOpenToolTip(true)}
							color="primary"
							radius="full"
							variant="shadow"
							className="max-w-[150px] flex jsutify-end text-end"
						>
							{defaultLanguage === "en-US" ? "Delete All" : "Изтрий всички"}
						</Button>
					</Tooltip>
				)}
			</div>
			{mediaData.length > 0 ? (
				<div className="flex flex-col items-end gap-4">
					<div className="flex sm:flex-row flex-col justify-between gap-4">
						<div className="flex flex-col">
							<div className="grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
								{mediaData?.map((item, idx) => (
									<CardComponent
										key={idx}
										data={item}
										onOpen={onOpen}
										setMediaId={setMediaId}
										setMovieMedia={setMovieMedia}
									/>
								))}
							</div>
						</div>
						<AdsComponent />
					</div>
				</div>
			) : (
				<div className="flex justify-center items-center">
					<h1 className="text-2xl">{noResultsMessage}</h1>
				</div>
			)}

			<MediaModal
				mediaId={mediaId}
				isMoviesMedia={isMovieMedia}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>

			{/* )} */}
			{/* <div className="flex justify-center items-center"><h1 className="text-2xl">{noResultsMessage}</h1></div> */}
		</div>
	);
};

export default Liked;
