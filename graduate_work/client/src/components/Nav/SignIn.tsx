import {
	Input,
	Button,
	Link,
	ModalBody,
	ModalHeader,
	Progress,
} from "@nextui-org/react";
import { useContext, useMemo, useState } from "react";
import SignInText from "./SignInText";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { Login } from "../App/handleFunctions";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { ResponseType, SignInTextProps } from "../App/props.interface";

type SignInProps = {
	onClose: () => void;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	isLogin: boolean;
};

const SignIn: React.FC<SignInProps> = ({ onClose, setIsLogin, isLogin }) => {
	const {
		defaultLanguage,
		setEmail,
		setUsername,
		setAccessToken,
		set_Id,
		setRole,
		setVerified,
		setIsWatch,
		setColor,
		setPublic,
		setScore,
	} = useContext<AppContextTypes>(AppContext);
	const {
		headerText,
		inputLabel,
		passwordLabel,
		descriptionUsr,
		descriptionPwd,
		SignInButtonText,
		notAMemberText,
		SignUpLink,
	} =
		defaultLanguage === "en-US"
			? (SignInText.en as SignInTextProps)
			: (SignInText.bg as SignInTextProps);
	const [data, setData] = useState<{ username: string; password: string }>({
		username: "",
		password: "",
	});
	const [errData, setErrData] = useState<{
		usr: string;
		pwd: string;
		server: string;
	}>({
		usr: "",
		pwd: "",
		server: "",
	});
	const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [successMsg, setSuccessMsg] = useState<string>("");
	const [progressValue, setProgressValue] = useState<number>(0);
	const [dots, setDots] = useState<number>(1);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		const response = (await Login(data, defaultLanguage)) as ResponseType;
		if (response.status !== 200) {
			console.log(`response`, response);
			setError(true);
			setErrData({
				...errData,
				server: response.message,
				usr: response?.type.includes("username") ? "username" : "",
				pwd: response?.type.includes("password") ? "password" : "",
			});
		} else {
			const interval = setInterval(() => {
				setProgressValue((val) => {
					if (val < 100) {
						return val + 1;
					}
					return 100;
				});
			}, 35);
			const dotsInterval = setInterval(() => {
				setDots((dots) => (dots < 3 ? dots + 1 : 1));
			}, 500);
			interval;
			dotsInterval;
			setSuccessMsg(response.message);
			set_Id(response.user._id);
			setEmail(response.user.email);
			setUsername(response.user.username);
			setRole(response.user.role);
			setVerified(response.user.verified);
			setIsWatch(response.user.isWatch);
			setColor(response.user.color);
			setPublic(response.user.isPublic);
			setScore(response.user.score);

			setAccessToken(true);

			setTimeout(() => {
				clearInterval(interval);
				clearInterval(dotsInterval);
				onClose();
			}, 4000);
		}
		setIsLoading(false);
	};

	const isUsrInvalid = useMemo(() => {
		if (data.username === "") return false;
		return /^[^\s]+$/i.test(data.username) &&
			data.username.length >= 3 &&
			errData.usr === ""
			? false
			: true;
	}, [data.username, errData.usr]);

	const isPswInvalid = useMemo(() => {
		if (data.password === "") return false;
		return /^[^\s]+$/i.test(data.password) &&
			data.password.length >= 5 &&
			errData.pwd === ""
			? false
			: true;
	}, [data.password, errData.pwd]);

	return (
		<>
			<ModalHeader className="flex flex-col gap-1">{headerText}</ModalHeader>
			<form onSubmit={handleSubmit}>
				{successMsg ? (
					<div className="flex flex-col px-8 py-[40px] gap-2 select-none">
						<h1>{successMsg}</h1>
						<Progress
							label={
								defaultLanguage === "en-US"
									? `Initializing credentials${".".repeat(dots)} `
									: `Инициализация на данни${".".repeat(dots)} `
								// '.'.repeat(dots)
							}
							aria-label="Initializing credentials"
							showValueLabel
							value={progressValue}
						/>
					</div>
				) : (
					<>
						<ModalBody className="mb-4">
							<Link className="mb-4" color="danger">
								{error && errData.server}
							</Link>
							<Input
								isClearable
								isDisabled={isLoading}
								isReadOnly={isLoading}
								isRequired
								type="text"
								variant="underlined"
								size="lg"
								label={inputLabel}
								value={data.username}
								isInvalid={isUsrInvalid}
								onClear={() => setData({ ...data, username: "" })}
								onChange={(e) =>
									setData({
										...data,
										username: e.target.value,
									})
								}
								className="mb-2 select-none text-white"
								disabled={isLoading}
								description={!isUsrInvalid ? descriptionUsr : undefined}
								errorMessage={error && errData.usr ? isUsrInvalid : undefined}
							/>
							<Input
								isRequired
								isDisabled={isLoading}
								isReadOnly={isLoading}
								type={isPasswordVisible ? "text" : "password"}
								variant="underlined"
								size="lg"
								label={passwordLabel}
								value={data.password}
								isInvalid={isPswInvalid}
								onChange={(e) =>
									setData({
										...data,
										password: e.target.value,
									})
								}
								className="mb-4 select-none text-white"
								description={!isPswInvalid ? descriptionPwd : undefined}
								errorMessage={error && errData.pwd ? isPswInvalid : undefined}
								endContent={
									<button
										className="focus:outline-none mr-3"
										type="button"
										onClick={() => setPasswordVisible(!isPasswordVisible)}
									>
										{isPasswordVisible ? <EyeOff /> : <Eye />}
									</button>
								}
							/>
						</ModalBody>
						<div className="flex flex-col w-fll items-center gap-4 justify-center mb-4">
							<Button
								type="submit"
								isDisabled={isLoading}
								color="primary"
								radius="full"
								variant="shadow"
								size="lg"
								className="w-[80%] mb-2"
								isLoading={isLoading}
								disabled={isLoading}
								endContent={
									<>
										{!isLoading && (
											<p className="bg-transparent text-[#fff] text-xl">
												<LogIn />
											</p>
										)}
									</>
								}
							>
								{isLoading
									? defaultLanguage === "bg-BG"
										? "Зареждане..."
										: "Loading..."
									: SignInButtonText}
							</Button>

							<p className="text-center text-sm mb-4">
								{notAMemberText}
								<Link
									underline="hover"
									isDisabled={isLoading}
									color="primary"
									onPress={() => setIsLogin(!isLogin)}
									className="cursor-pointer ml-1"
								>
									{SignUpLink}
								</Link>
							</p>
						</div>
					</>
				)}
			</form>
		</>
	);
};

export default SignIn;
