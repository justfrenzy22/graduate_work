import { useState } from "react";
import {
	Modal,
	ModalContent,
} from "@nextui-org/react";
import { AuthModalProps } from "../App/props.interface";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onOpenChange }) => {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<>
			<Modal
				backdrop="blur"
				className="bg-transparent/60 shadow-xl text-white"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				placement="center"
				size="md"
				classNames={{
					backdrop: "  ",
				}}
				shadow="lg"
				motionProps={{
					variants: {
						enter: {
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.3,
								ease: "easeOut",
							},
						},
						exit: {
							y: -20,
							opacity: 0,
							transition: {
								duration: 0.2,
								ease: "easeIn",
							},
						},
					},
				}}
			>
				<ModalContent>
					{(onClose: any) => (
						<>
							{isLogin ? (
								<SignIn
									onClose={onClose}
									setIsLogin={setIsLogin}
									isLogin={isLogin}
								/>
							) : (
								<SignUp
									// onClose={onClose}
									setIsLogin={setIsLogin}
									isLogin={isLogin}
								/>
							)}
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AuthModal;
