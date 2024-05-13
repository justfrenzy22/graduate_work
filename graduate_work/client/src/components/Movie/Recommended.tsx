import { useState } from "react";
import { mediaType } from "../App/props.interface";
import MediaList from "../Filter/MediaList";
import MediaModal from "../App/MediaModal";
import { useDisclosure } from "@nextui-org/react";

interface RecommendedProps {
	recommended: mediaType[];
}

const Recommended: React.FC<RecommendedProps> = ({ recommended }) => {

	const [isMovieMedia, setMovieMedia] = useState<boolean>(false);
	const [mediaId, setMediaId] = useState(0);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<div className="mb-8 flex items-center justify-center">
			<MediaList
				data={recommended}
				onOpen={onOpen}
				setMediaId={setMediaId}
				setMovieMedia={setMovieMedia}
				title="Recommended"
			/>
			<MediaModal
				isMoviesMedia={isMovieMedia}
				mediaId={mediaId}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>
		</div>
	);
};

export default Recommended;
