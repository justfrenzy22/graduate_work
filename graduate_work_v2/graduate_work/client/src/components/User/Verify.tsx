import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { VerifyUser } from "../App/handleFunctions";
import { Button } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";

const Verify = () => {
	const { defaultLanguage, setAccessToken } =
		useContext<AppContextTypes>(AppContext);
	const [bigText, setBigText] = useState<string>("");
	const [isVerified, setIsVerified] = useState<boolean>(false);

	const navigate = useNavigate();

	const { token } = useParams<{ token: string }>();

	useEffect(() => {
		const verifyUser = async () => {
			const response = (await VerifyUser(
				token as string,
				defaultLanguage as AppContextTypes["defaultLanguage"]
			)) as {
				status: number;
				message: string;
			};

			if (response.status === 200 || response.status === 400) {
				setAccessToken(true);
				setBigText(response.message);
				setIsVerified(true);
			} else {
				setAccessToken(false);
				setBigText(response.message);
			}
		};
		verifyUser();
	}, [defaultLanguage, setAccessToken, token]);

	return (
		<>
			{/* <div
				className={`bg-gradient-to-tl ${themeStyle[themeKey as keyof typeof themeStyle]} `}
			> */}
			{/* <div className="flex flex-col min-h-[100vh] py-3 sm:py-[20px] gap-3 sm:gap-[20px]  px-[10px] sm:px-[60px]  items-center justify-center"></div> */}
			<div className="flex items-center flex-col gap-4 justify-center h-[92vh] w-full">
				<h1 className="sm:text-6xl text-4xl text-center font-bold w-full">
					{bigText}
				</h1>
				<div className="w-full max-w-md text-center">
					<p className="text-2xl">
						{isVerified ? (
							<p>
								{defaultLanguage === "bg-BG"
									? `Благодарим Ви, че потвърдихте профила си 😇`
									: `Thank you for verifying your profile 😇`}
							</p>
						) : (
							<p>
								{defaultLanguage === "bg-BG"
									? `Вашият профил не е активиран`
									: `Your profile is not activated`}
							</p>
						)}
					</p>
				</div>
				<Button
					radius="full"
					color="primary"
					variant="shadow"
					onPress={() => navigate("/")}
					size="lg"
					className="mt-2"
				>
					{defaultLanguage === "bg-BG" ? `назад` : `Back`}
				</Button>
			</div>
			{/* </div> */}
		</>
	);
};

export default Verify;
