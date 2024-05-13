import { DropdownItem, DropdownMenu, DropdownSection } from "@nextui-org/react";
import { LogIn } from "lucide-react";
import React from "react";
import { AppContextTypes } from "../../utils/AppContext";

type LoggedOutViewProps = {
	theme: AppContextTypes["theme"];
	setTheme: AppContextTypes["setTheme"];
	system: string;
	dark: string;
	light: string;
	themeText: string;
	defaultLanguage: AppContextTypes["defaultLanguage"];
	changeLanguage: (lang: AppContextTypes["defaultLanguage"]) => void;
	bg: string;
	en: string;
	language: string;
	onOpen: () => void;
	signInBtn: string;
};

const LoggedOutView: React.FC<LoggedOutViewProps> = ({
	theme,
	setTheme,
	system,
	dark,
	light,
	themeText,
	defaultLanguage,
	changeLanguage,
	bg,
	en,
	language,
	onOpen,
	signInBtn,
}) => {
	return (
		<DropdownMenu variant="light" aria-label="dropdown menu">
			<DropdownSection
				// title={``}
				showDivider
			>
				<DropdownItem
					isReadOnly
					key={`theme`}
					endContent={
						<select
							defaultValue={theme}
							onChange={(e) => {
								setTheme(e.target.value);
							}}
							className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
							id="theme"
							name="theme"
						>
							<option value={`system`}>{system}</option>
							<option value={`dark`}>{dark}</option>
							<option value={`light`}>{light}</option>
						</select>
					}
				>
					{themeText}
				</DropdownItem>
				<DropdownItem
					isReadOnly
					key={`language`}
					endContent={
						<select
							defaultValue={defaultLanguage}
							onChange={(e) => {
								changeLanguage(
									e.target.value as AppContextTypes["defaultLanguage"]
								);
							}}
							className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
							id="theme"
							name="theme"
						>
							<option value={`bg-BG`}>{bg}</option>
							<option value={`en-US`}>{en}</option>
						</select>
					}
				>
					{language}
				</DropdownItem>
			</DropdownSection>
			<DropdownSection>
				<DropdownItem shortcut={<LogIn size={16} />} onPress={() => onOpen()}>
					{signInBtn}
				</DropdownItem>
			</DropdownSection>
		</DropdownMenu>
	);
};

export default LoggedOutView;
