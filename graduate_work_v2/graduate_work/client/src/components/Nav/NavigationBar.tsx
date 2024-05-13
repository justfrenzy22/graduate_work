import { useCallback, useContext, useEffect, useState } from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownSection,
	DropdownItem,
	Avatar,
	AvatarIcon,
	Accordion,
	AccordionItem,
	Divider,
} from "@nextui-org/react";
import AuthModal from "./AuthModal";
import { menuItemsList, NavbarText } from "./NavigationBarText";
import { NavbarTextTypes } from "../App/props.interface";
import { useNavigate } from "react-router-dom";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import LoggedOutView from "./LoggedOutView";
import LoggedInView from "./LoggedInView";
import Logo from "./Logo";

const NavigationBar = (): JSX.Element => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [actColor, setActColor] = useState<
		"primary" | "secondary" | "default" | "success" | "warning" | "danger"
	>("default");
	// const { isOpenLogin, onOpenLogin, onOpenChangeLogin } = useDisclosure();
	const {
		defaultLanguage,
		setDefaultLanguage,
		accessToken,
		setAccessToken,
		color,
		username,
		email,
		setTheme,
		theme,
		isOpen,
		onOpen,
		onOpenChange,
	} = useContext<AppContextTypes>(AppContext);
	const menuItems =
		defaultLanguage === "en-US" ? menuItemsList.en : menuItemsList.bg;
	const {
		system,
		dark,
		light,
		themeText,
		bg,
		en,
		language,
		signInBtn,
		popularTxt,
		trendingTxt,
		nowPlayingTxt,
		categories,
	} =
		defaultLanguage === "en-US"
			? (NavbarText.en as NavbarTextTypes)
			: (NavbarText.bg as NavbarTextTypes);
	const navigate = useNavigate();

	const changeLanguage = (lang: AppContextTypes["defaultLanguage"]) => {
		setDefaultLanguage(lang);
		localStorage.setItem("language", lang);
	};

	const handleLogoClick = useCallback(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		navigate("/");
	}, [navigate]);

	const handleNavigation = useCallback(
		(
			type: "movie" | "tv",
			category: "popular" | "trending" | "now_playing",
			page: string
		) => {
			isMenuOpen && setIsMenuOpen(false);
			navigate(`/${type}/${category}?page=${page}`);
		},
		[navigate, isMenuOpen]
	);

	useEffect(() => {
		switch (color) {
			case "purple":
				setActColor("secondary");
				break;
			case "blue":
				setActColor("primary");
				break;
			case "green":
				setActColor("success");
				break;
			case "red":
				setActColor("danger");
				break;
			case "yellow":
				setActColor("warning");
				break;
			default:
				break;
		}
	}, [color]);

	return (
		<>
			<Navbar
				onMenuOpenChange={setIsMenuOpen}
				isMenuOpen={isMenuOpen}
				isBordered
				shouldHideOnScroll
			>
				<NavbarContent>
					<NavbarMenuToggle
						aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						className="sm:hidden"
					/>
					<NavbarBrand>
						<Button
							startContent={<Logo />}
							onClick={() => handleLogoClick()}
							// color="foreground"
							variant="light"
							className="cursor-pointer font-bold text-xl"
						>
							CrackFlix
						</Button>
					</NavbarBrand>
				</NavbarContent>

				<NavbarContent className="hidden sm:flex gap-8" justify="center">
					{menuItems.map((item, index) => (
						<NavbarItem key={`${item}-${index}`}>
							<Dropdown
								showArrow
								backdrop="blur"
								className="bg-background/60 text-white"
								classNames={{
									content: "py-1 px-1",
								}}
							>
								<DropdownTrigger>
									<Link
										color="foreground"
										className="cursor-pointer rounded-full"
									>
										{item}
									</Link>
								</DropdownTrigger>
								<DropdownMenu variant="light" aria-label="dropdown">
									<DropdownSection title={categories as string}>
										<DropdownItem
											onClick={() =>
												handleNavigation(
													index === 0 ? `movie` : `tv`,
													`popular`,
													`1`
												)
											}
											key={`popular`}
										>
											{popularTxt}
										</DropdownItem>
										<DropdownItem
											onClick={() =>
												handleNavigation(
													index === 0 ? "movie" : "tv",
													`trending`,
													`1`
												)
											}
											key={`trending`}
										>
											{trendingTxt}
										</DropdownItem>
										<DropdownItem
											onClick={() =>
												handleNavigation(
													index === 0 ? "movie" : "tv",
													`now_playing`,
													`1`
												)
											}
											key={`now_playing`}
										>
											{nowPlayingTxt}
										</DropdownItem>
									</DropdownSection>
								</DropdownMenu>
							</Dropdown>
						</NavbarItem>
					))}
				</NavbarContent>

				<NavbarContent justify="end">
					<NavbarItem>
						<Dropdown showArrow className="bg-background/90 ">
							<DropdownTrigger>
								<Button
									size="lg"
									as={Link}
									color="primary"
									radius="full"
									variant={accessToken ? "faded" : "bordered"}
									isIconOnly
								>
									<Avatar
										icon={!accessToken ? <AvatarIcon /> : ""}
										color={actColor}
										name={accessToken ? username : ""}
										classNames={{
											base: `${!accessToken ? `bg-transparent` : ``}`,
											icon: "",
										}}
									/>
								</Button>
							</DropdownTrigger>
							{!accessToken ? (
								<LoggedOutView
									theme={theme}
									setTheme={setTheme}
									system={system}
									dark={dark}
									light={light}
									themeText={themeText}
									defaultLanguage={defaultLanguage}
									changeLanguage={changeLanguage}
									bg={bg}
									en={en}
									language={language}
									signInBtn={signInBtn}
									onOpen={onOpen}
								/>
							) : (
								<LoggedInView
									theme={theme}
									setTheme={setTheme}
									defaultLanguage={defaultLanguage}
									changeLanguage={changeLanguage}
									email={email}
									username={username}
									setAccessToken={setAccessToken}
								/>
							)}
						</Dropdown>
					</NavbarItem>
				</NavbarContent>
				<NavbarMenu className="dark flex gap-2">
					{menuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							{index === 1 ? <Divider /> : null}
							<Accordion>
								<AccordionItem key={1} title={item}>
									<div className="pl-[20px]">
										<ul className="list-disc flex flex-col gap-[20px]">
											<li>
												<Link
													color="foreground"
													className="w-full"
													href="#"
													size="lg"
													onClick={() =>
														handleNavigation(
															index === 0 ? "movie" : "tv",
															"popular",
															"1"
														)
													}
												>
													{popularTxt}
												</Link>
											</li>
											<li>
												<Link
													color="foreground"
													className="w-full"
													href="#"
													size="lg"
													onClick={() =>
														handleNavigation(
															index === 0 ? "movie" : "tv",
															"trending",
															"1"
														)
													}
												>
													{trendingTxt}
												</Link>
											</li>
											<li>
												<Link
													color="foreground"
													className="w-full"
													href="#"
													size="lg"
													onClick={() =>
														handleNavigation(
															index === 0 ? "movie" : "tv",
															"now_playing",
															"1"
														)
													}
												>
													{nowPlayingTxt}
												</Link>
											</li>
										</ul>
									</div>
								</AccordionItem>
							</Accordion>
						</NavbarMenuItem>
					))}
				</NavbarMenu>
			</Navbar>
			<AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</>
	);
};

export default NavigationBar;
