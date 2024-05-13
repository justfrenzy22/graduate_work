import { useContext, useEffect, useState } from "react";
import { DiscordToken } from "../App/handleFunctions";
import { AppContext, AppContextTypes } from "../../utils/AppContext";

const Discord = () => {
	const [result, setResult] = useState<string>("");
	const [authCode, setAuthCode] = useState<string>("");

	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);

		const code = queryParams.get("code");

		if (code) {
			setAuthCode(code);
		}

		DiscordToken(authCode, defaultLanguage).then((res) => {
			setResult(res.message);
		});
	}, [authCode, defaultLanguage]);

	return (
		<div>
			{result ? (
				<div>Success! Data recieved from {JSON.stringify(result)}</div>
			) : (
				<p>Wrong auth code: {JSON.stringify(result)}</p>
			)}
		</div>
	);
};

export default Discord;
