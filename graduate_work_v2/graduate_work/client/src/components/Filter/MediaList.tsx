import { Link } from "@nextui-org/react";
import AdsComponent from "../HomePage/AdsComponent";

import CardComponent from "./CardComponent";
import { mediaType } from "../App/props.interface";
// import { useNavigate } from "react-router-dom";

type MediaListTypes = {
	title: string;
	data: mediaType[];
	onOpen: () => void;
	setMediaId: React.Dispatch<React.SetStateAction<number>>;
    setMovieMedia: React.Dispatch<React.SetStateAction<boolean>>;
};

const MediaList: React.FC<MediaListTypes> = ({
	title,
	data,
	onOpen,
	setMediaId,
    setMovieMedia,
}) => {
	// const navigate = useNavigate();
	return (
		<div className="flex flex-col md:flex-row gap-4 py-[10px] sm:px-[40px] px-[10px]">
			<div className="flex justify-between">
				<div className="flex flex-col">
					<div className="flex flex-row items-center gap-3 justify-start mb-4">
						<Link
							className="cursor-pointer text-4xl font-bold rounded-full"
							color="primary"
						>
							{title}
						</Link>
					</div>
					<div className="grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
						{data?.map((item) => (
							<CardComponent
								key={item.id}
								data={item}
								onOpen={onOpen}
								setMediaId={setMediaId}
                                setMovieMedia={setMovieMedia}
							/>
						))}
					</div>
				</div>
			</div>
			{/* Render the ads component */}
			<AdsComponent />
		</div>
	);
};

export default MediaList;
