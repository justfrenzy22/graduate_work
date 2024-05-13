import {
	Input,
	Button,
	Link,
	ModalBody,
	ModalHeader,
	Progress,
} from '@nextui-org/react';
import { useContext, useMemo, useState } from 'react';
// import AppContext from '../AppContext';
import SignUpText from './SingUpText';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { Register } from '../App/handleFunctions';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import { ResponseType } from '../App/props.interface';

interface SignUpProps {
	// onClose: () => void;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
	isLogin: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ setIsLogin, isLogin }) => {
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	const [data, setData] = useState<{
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}>({ username: '', email: '', password: '', confirmPassword: '' });
	const [errData, setErrData] = useState<{
		usr: string;
		eml: string;
		pwd: string;
		cpwd: string;
		server: string;
	}>({
		usr: '',
		eml: '',
		pwd: '',
		cpwd: '',
		server: '',
	});
	const {
		headerText,
		usernameLabel,
		emailLabel,
		passwordLabel,
		confirmPasswordLabel,
		descriptionEmail,
		descriptionUsername,
		SingUpButtonText,
		notAMemberText,
		SignInLink,
		usernameErrorMsg,
		emailErrorMsg,
		passwordErrorMsg,
		confirmPasswordErrorMsg,
	} = defaultLanguage === 'en-US' ? SignUpText.en : SignUpText.bg;
	const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
	const [isConfirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [successMsg, setSuccessMsg] = useState<string>('');
	const [progressValue, setProgressValue] = useState<number>(0);
	const [dots, setDots] = useState<number>(1);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		const response = (await Register(
			data,
			defaultLanguage
		)) as ResponseType;
		if (response.status !== 200) {
			setError(true);
			setErrData({
				usr: response.type === 'username' ? response.message : '',
				eml: response.type === 'email' ? response.message : '',
				pwd: response.type === 'password' ? response.message : '',
				cpwd:
					response.type === 'confirmPassword' ? response.message : '',
				server: response.type === 'server' ? response.message : '',
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
			setTimeout(() => {
				setIsLogin(true);
			}, 4000);
		}
		setIsLoading(false);
	};
	const isUsrInvalid = useMemo(() => {
		if (data.username === '') return false;
		return /^[^\s]+$/i.test(data.username) &&
			data.username.length >= 3 &&
			errData.usr === ''
			? false
			: true;
	}, [data.username, errData.usr]);

	const isEmlInvalid = useMemo(() => {
		if (data.email === '') return false;
		return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email) &&
			errData.eml === ''
			? false
			: true;
	}, [data.email, errData.eml]);

	const isPswInvalid = useMemo(() => {
		if (data.password === '') return false;
		return /^[^\s]+$/i.test(data.password) && data.password.length >= 5
			? false
			: true;
	}, [data.password]);

	const isCnfPswInvalid = useMemo(() => {
		if (data.confirmPassword === '') return false;

		return data.confirmPassword === data.password ? false : true;
	}, [data.confirmPassword, data.password]);

	return (
		<>
			<>
				<ModalHeader className="flex flex-col gap-1">
					{headerText}
				</ModalHeader>
				<form onSubmit={handleSubmit}>
					{successMsg ? (
						<div className="flex flex-col px-8 py-[40px] gap-2 select-none">
							<h1>{successMsg}</h1>
							{/* <p>{defaultLanguage === "en" ? "We're redirecting you to login" : "Пренасочваме ви към влизане в акаунта Ви"} { Array.from({ length: dots }).map((_, idx: number) => <span key={idx}>.</span>) }</p> */}
							<Progress
								label={
									defaultLanguage === 'en-US'
										? `We're redirecting you to login${'.'.repeat(dots)}`
										: `Пренасочваме ви към влизане в акаунта Ви${'.'.repeat(dots)}`
								}
								showValueLabel
								value={progressValue}
							/>
						</div>
					) : (
						<>
							<ModalBody className="mb-4">
								<Link
									className="mb-4"
									color="danger"
								>
									{error && errData.server}
								</Link>
								<Input
									isClearable
									isRequired
									isDisabled={isLoading}
									isReadOnly={isLoading}
									type="text"
									variant="underlined"
									size="lg"
									label={usernameLabel}
									value={data.username}
									isInvalid={isUsrInvalid}
									onClear={() =>
										setData({ ...data, username: '' })
									}
									onChange={(e) =>
										setData({
											...data,
											username: e.target.value,
										})
									}
									className="mb-2 select-none"
									description={
										!isUsrInvalid
											? descriptionUsername
											: undefined
									}
									errorMessage={
										error && isUsrInvalid
											? errData.usr
											: isUsrInvalid
												? usernameErrorMsg
												: undefined
									}
								/>
								<Input
									isClearable
									isDisabled={isLoading}
									isReadOnly={isLoading}
									isRequired
									type="email"
									variant="underlined"
									size="lg"
									label={emailLabel}
									value={data.email}
									isInvalid={isEmlInvalid}
									onClear={() =>
										setData({ ...data, email: '' })
									}
									onChange={(e) =>
										setData({
											...data,
											email: e.target.value,
										})
									}
									className="mb-2 select-none"
									description={
										!isEmlInvalid
											? descriptionEmail
											: undefined
									}
									errorMessage={
										error && isEmlInvalid
											? errData.eml
											: isEmlInvalid
												? emailErrorMsg
												: undefined
									}
								/>

								<Input
									isRequired
									isDisabled={isLoading}
									isReadOnly={isLoading}
									type={
										isPasswordVisible ? 'text' : 'password'
									}
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
									className="mb-2 select-none"
									errorMessage={
										isPswInvalid
											? passwordErrorMsg
											: undefined
									}
									endContent={
										<button
											className="focus:outline-none mr-3"
											type="button"
											onClick={() =>
												setPasswordVisible(
													!isPasswordVisible
												)
											}
										>
											{isPasswordVisible ? (
												<EyeOff />
											) : (
												<Eye />
											)}
										</button>
									}
								/>

								<Input
									isRequired
									isDisabled={isLoading}
									isReadOnly={isLoading}
									type={
										isConfirmPasswordVisible
											? 'text'
											: 'password'
									}
									variant="underlined"
									size="lg"
									label={confirmPasswordLabel}
									value={data.confirmPassword}
									isInvalid={isCnfPswInvalid}
									onChange={(e) =>
										setData({
											...data,
											confirmPassword: e.target.value,
										})
									}
									className="mb-4 select-none"
									errorMessage={
										isCnfPswInvalid
											? confirmPasswordErrorMsg
											: undefined
									}
									endContent={
										<button
											className="focus:outline-none mr-3"
											type="button"
											onClick={() =>
												setConfirmPasswordVisible(
													!isConfirmPasswordVisible
												)
											}
										>
											{isConfirmPasswordVisible ? (
												<EyeOff />
											) : (
												<Eye />
											)}
										</button>
									}
								/>
							</ModalBody>
							<div className="flex flex-col w-fll items-center gap-4 justify-center mb-4">
								<Button
									color="primary"
									radius="full"
									variant="shadow"
									className="w-[80%] mb-2"
									size="lg"
									isLoading={isLoading}
									disabled={isLoading}
									endContent={
										<>
											{!isLoading && (
												<p className="bg-transparent text-[#fff] text-xl ">
													<UserPlus />
												</p>
											)}
										</>
									}
									type="submit"
								>
									{SingUpButtonText}
								</Button>

								<p className="text-center text-sm mb-4">
									{notAMemberText}
									<Link
										underline="hover"
										color="primary"
										isDisabled={isLoading}
										onPress={() => setIsLogin(!isLogin)}
										className="cursor-pointer ml-1"
									>
										{SignInLink}
									</Link>
								</p>
							</div>
						</>
					)}
				</form>
			</>
		</>
	);
};

export default SignUp;
