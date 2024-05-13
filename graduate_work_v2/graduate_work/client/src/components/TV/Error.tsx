import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { TVTextTypes } from "./ErrorText";

const ErrorComponent: React.FC<TVTextTypes> = ({
	errorText,
	smallText,
	backBtn,
}) => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center text-center flex-col gap-4 justify-center h-[92vh] p-2 sm:p-4 ">
				<h1 className="text-4xl sm:text-8xl font-bold text-center">{errorText}</h1>
				<div className="w-full max-w-xl text-center">
					<p className="text-xl sm:text-2xl">{smallText}</p>
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
