import React, { useContext, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import {
	Avatar,
	Button,
	Divider,
	Input,
	Link,
	Tooltip,
} from "@nextui-org/react";
import { CommentI } from "../App/props.interface";
import {
	AddComment,
	DeleteComment,
	ReplyComment,
	ViewMoreComments,
} from "../App/handleFunctions";
import { useNavigate } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface CommentsProps {
	comments: CommentI[];
	mediaId: string | undefined;
	mediaType: "movie" | "tv";
}

const Comments: React.FC<CommentsProps> = ({
	comments,
	mediaId,
	mediaType,
}) => {
	const {
		accessToken,
		onOpen,
		username,
		_id,
		defaultLanguage,
		theme,
		systemTheme,
	} = useContext<AppContextTypes>(AppContext);
	const [content, setContent] = useState<string>("");
	const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
		null
	);

	// const isExpanded = expandedComments.includes(comment.id);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (content.length > 3) {
			const response = await AddComment(
				_id,
				username,
				content,
				mediaType,
				mediaId,
				replyingToCommentId, // Include the comment id here
				defaultLanguage
			);

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

			setTimeout(() => {
				window.location.reload();
			}, 2000);

			console.log(`response`, response);
			// Reset the reply state after submitting the comment
			setReplyingToCommentId(null);
		}
	};

	return (
		<>
			{accessToken ? (
				<div className="flex flex-col p-4 gap-[30px] sm:bg-background/40 bg-background/40 dark:bg-default/40 rounded-xl ">
					{/* <Card  className="w-full flex flex-col p-8 gap-4"> */}
					<form onSubmit={handleSubmit}>{addComment(content, setContent)}</form>
					<h1>{defaultLanguage === "en-US" ? "Comments" : "Коментари"}:</h1>
					<div className="flex flex-col gap-2">
						{comments.map((comment) => (
							<Comment
								key={comment._id}
								comment={comment}
								mediaId={mediaId as string}
								mediaType={mediaType}
							/>
						))}
					</div>
				</div>
			) : (
				<div onClick={onOpen}>
					{defaultLanguage === "en-US"
						? "Login to see comments"
						: "Влезте, за да видите коментари"}
				</div>
			)}
		</>
	);
};

export default Comments;

function addComment(
	// handleSubmit: (e: React.FormEvent) => Promise<void>,
	content: string,
	setContent: React.Dispatch<React.SetStateAction<string>>
) {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);
	return (
		<div
			className="flex flex-row items-center justify-center gap-2 w-full"
			// onSubmit={handleSubmit}
		>
			<Input
				placeholder={
					defaultLanguage === "en-US" ? "Write a comment" : "Добавете коментар"
				}
				variant="bordered"
				color="primary"
				value={content}
				className="w-full"
				required
				onChange={(e) => setContent(e.target.value)}
				endContent={
					<Button type="submit" radius="lg" color="primary" variant="shadow">
						{defaultLanguage === "en-US" ? "Submit" : "Изпрати"}
					</Button>
				}
			/>
			{/* <Button type="submit" radius="lg" color="primary" variant="shadow">
            Submit
        </Button> */}
		</div>
	);
}

interface CommentProps {
	// handleSubmit: (e: React.FormEvent) => Promise<void>;
	comment: CommentI;
	mediaId: string;
	mediaType: "movie" | "tv";
}

const Comment: React.FC<CommentProps> = ({ comment, mediaId, mediaType }) => {
	const toggleExpanded = () => {
		setExpanded((prevExpanded) => !prevExpanded);
	};

	const { username, _id, defaultLanguage, theme, systemTheme } =
		useContext<AppContextTypes>(AppContext);
	const [expanded, setExpanded] = useState(false);
	const [extendComm, setExtendComm] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [nestedComments, setNestedComments] = useState<CommentI[]>([]);
	const [content, setContent] = useState<string>("");
	const [isDel, setDel] = useState<boolean>(false);
	const [commSoon, setCommSoon] = useState<boolean>(false);
	const navigate = useNavigate();

	const themeKey: AppContextTypes["theme"] =
		theme === "system" ? (systemTheme ? "dark" : "light") : theme;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (content.length > 3) {
			const response = await ReplyComment(
				_id,
				username,
				content,
				mediaType,
				mediaId,
				comment._id, // Include the comment id here
				defaultLanguage
			);

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

			setTimeout(() => {
				window.location.reload();
			}, 2000);
			// Reset the reply state after submitting the comment
			// setReplyingToCommentId(null);
		}
	};

	const getElapsedTime = (createdAt: CommentI["createdAt"]) => {
		const now = new Date();
		const commentDate = new Date(Date.parse(createdAt));
		const elapsedTime = now.getTime() - commentDate.getTime();

		const minutes = Math.floor(elapsedTime / (1000 * 60));
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		const isBulgarian = defaultLanguage === "bg-BG";

		if (minutes < 1) {
			return isBulgarian ? "Току-що" : "Just now";
		} else if (minutes < 60) {
			return isBulgarian
				? `преди ${minutes} минут${minutes > 1 ? "и" : "а"}`
				: `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else if (hours < 24) {
			return isBulgarian
				? `преди ${hours} час${hours > 1 ? "а" : ""}`
				: `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else {
			return isBulgarian
				? `преди ${days} ден${days > 1 ? "а" : ""}`
				: `${days} day${days > 1 ? "s" : ""} ago`;
		}
	};

	// Example usage
	const formattedElapsedTime = getElapsedTime(comment.createdAt);

	const fetchNestedComments = async () => {
		setLoading(true);
		const response = await ViewMoreComments(
			mediaType,
			mediaId,
			comment._id,
			defaultLanguage
		);

		setNestedComments(response.comments);
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

		setLoading(false);
	};

	const handleViewMoreClick = () => {
		if (!extendComm) {
			fetchNestedComments();
		}
		setExtendComm(!extendComm);
	};

	const deleteComment = async (id: string) => {
		const response = await DeleteComment(id, defaultLanguage);

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
		if (response.status === 200) {
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	};

	return (
		<div className="flex flex-col p-2 gap-[10px] sm:bg-background/40 bg-background/40 dark:bg-default/40 rounded-xl ">
			<div className="w-full">
				<form onSubmit={handleSubmit} className="w-full">
					<div className="flex flex-row justify-between items-center w-full">
						<div>
							<div className="flex items-start flex-col gap-2">
								<div className="flex items-center justify-center flex-row gap-2">
									<Avatar name={comment.username} color="primary" />
									<Link
										className="font-bold cursor-pointer"
										color="foreground"
										onPress={() => {
											window.scrollTo({ top: 0, behavior: "smooth", left: 0 });
											navigate(`/acc/${comment.username}`);
										}}
									>
										{comment.username}
									</Link>
									<Divider className="h-[20px]" orientation="vertical" />
									<p>{formattedElapsedTime}</p>
								</div>
								<div>
									<p>{comment.content}</p>
								</div>
							</div>
							<Button
								color="primary"
								variant="shadow"
								radius="full"
								onClick={toggleExpanded}
								// endContent={expanded ? <ChevronUp /> : <ChevronDown />}
							>
								{expanded
									? defaultLanguage === "en-US"
										? "Reply"
										: "Отговори"
									: defaultLanguage === "en-US"
										? "Reply"
										: "Отговори"}
							</Button>
						</div>

						<Tooltip
							isOpen={isDel}
							showArrow
							content={
								<div className="flex flex-col gap-1 w-full justify-center items-center">
									{" "}
									<Tooltip
										showArrow
										isOpen={commSoon}
										content={
											<div>
												{defaultLanguage === "en-US"
													? "Coming soon"
													: "Очаквайте скоро"}
											</div>
										}
									>
										<Button
											onPress={() => setCommSoon(!commSoon)}
											// radius="full"
											color="primary"
											className="w-full"
											variant="flat"
											isIconOnly
										>
											{defaultLanguage === "en-US" ? "Edit" : "Промени"}
										</Button>
									</Tooltip>
									<Button
										onPress={() => deleteComment(comment._id)}
										color="danger"
										variant="flat"
										className="w-full"
									>
										{defaultLanguage === "en-US" ? "Delete" : "Изтрий"}
									</Button>
								</div>
							}
						>
							<Button
								onPress={() => setDel(!isDel)}
								radius="full"
								color="primary"
								className="mr-4"
								variant="flat"
								isIconOnly
								endContent={<>•••</>}
							/>
						</Tooltip>
					</div>
					<div className="w-full">
						{expanded && (
							<div className="mt-2 w-full flex items-center justify-center">
								{addComment(content, setContent)}
							</div>
						)}
					</div>
				</form>
				{/* <Button className="flex flex-row justify-end"><Dot /><Dot /><Dot /></Button> */}
			</div>
			{comment.hasNestedComments && (
				<>
					<Button
						color="primary"
						variant="shadow"
						radius="full"
						className="w-[100px]"
						disabled={isLoading}
						onClick={handleViewMoreClick}
						endContent={<ChevronUp size={20} />}
					>
						{extendComm
							? defaultLanguage === "en-US"
								? "Close"
								: "Затвори"
							: defaultLanguage === "en-US"
								? "View more"
								: "Виж повече"}
					</Button>
					{extendComm &&
						nestedComments.map((nestedComment) => (
							<div key={nestedComment._id} className="pl-2">
								<Comment
									comment={nestedComment}
									mediaId={mediaId}
									mediaType={mediaType}
								/>
							</div>
						))}
				</>
			)}
		</div>
	);
};
