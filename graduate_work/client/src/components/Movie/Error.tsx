import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { MovieTextTypes } from "./ErrorText";

const ErrorComponent: React.FC<MovieTextTypes> = ({
	errorText,
	smallText,
	backBtn,
}) => {
	const navigate = useNavigate();
	return (
		<div className="flex items-center flex-col gap-4 justify-center h-[92vh] w-full">
			<h1 className="text-8xl font-bold">{errorText}</h1>
			<div className="w-full max-w-md text-center">
				<p className="text-2xl">{smallText}</p>
			</div>
			<Button
				radius="full"
				color="primary"
				variant="shadow"
				onPress={() => navigate("/")}
				size="lg"
				className="mt-2"
			>
				{backBtn}
			</Button>
		</div>
	);
};

export default ErrorComponent;
