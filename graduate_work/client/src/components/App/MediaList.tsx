import { Link } from "@nextui-org/react";
import AdsComponent from "../HomePage/AdsComponent";
import { mediaType } from "./props.interface";
import CardComponent from "./CardComponent";
// import { useNavigate } from "react-router-dom";

type MediaListTypes = {
	title: string;
	data: mediaType[];
	onOpen: () => void;
	setMediaId: React.Dispatch<React.SetStateAction<number>>;
	isMovie: boolean;
};

const MediaList: React.FC<MediaListTypes> = ({
	title,
	data,
	onOpen,
	setMediaId,
	isMovie
}) => {
	return (
		<div className="flex flex-col md:flex-row gap-4 py-[10px] sm:px-[40px] px-[10px] z-0">
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
								isMovie={isMovie}
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
