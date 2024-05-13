import { Tabs, Tab } from "@nextui-org/react";
import { Clock3, Heart, LayoutDashboard, Settings, Shield } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

const UserTabs = () => {
	// const {  } = useParams();
	const { defaultLanguage, role } = useContext<AppContextTypes>(AppContext);
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname.split("/user/")[1] || "profile";
		setSelected(path);
	}, [location]);
	const [selected, setSelected] = useState<string | number>();
	const navigate = useNavigate();

	return (
		<Tabs
			aria-label="user tabs"
			selectedKey={selected}
			className="w-full flex justify-center items-center mb-4"
			onSelectionChange={setSelected}
			color="primary"
			variant="bordered"
			radius="lg"
		>
			<Tab
				key={`liked`}
				title={
					<div
						className="flex items-center space-x-2"
						onClick={() => navigate("/user/liked")}
					>
						<Heart />{" "}
						<span>{defaultLanguage === "bg-BG" ? "Харесвани" : "Liked"}</span>
					</div>
				}
			/>
			<Tab
				key={`watched`}
				// onClick={() => navigate('/user/watched')}
				title={
					<div
						className="flex items-center space-x-2"
						onClick={() => navigate("/user/watched")}
					>
						<Clock3 />{" "}
						<span>{defaultLanguage === "bg-BG" ? "Гледани" : "Watched"}</span>
					</div>
				}
			/>
			<Tab
				key={`profile`}
				// onClick={() => navigate("/user/profile")}
				title={
					<div
						className="flex items-center space-x-2"
						onClick={() => navigate("/user/profile")}
					>
						<LayoutDashboard />{" "}
						<span>{defaultLanguage === "bg-BG" ? "Профил" : "Profile"}</span>
					</div>
				}
			/>
			<Tab
				key={`settings`}
				// onClick={() => navigate("/user/settings")}
				title={
					<div
						className="flex items-center space-x-2"
						onClick={() => navigate("/user/settings")}
					>
						<Settings />{" "}
						<span>
							{defaultLanguage === "bg-BG" ? "Настройки" : "Settings"}
						</span>
					</div>
				}
			/>
			{role !== "user" && (
				<Tab
					key={`admin`}
					// onClick={() => navigate("/user/admin")}
					title={
						// onClick={() => navigate("/user/admin")}
						<div
							className="flex items-center space-x-2"
							onClick={() => navigate("/user/admin")}
						>
							<Shield />{" "}
							<span>{defaultLanguage === "bg-BG" ? "Админ" : "Admin"}</span>
						</div>
					}
				/>
			)}
		</Tabs>
	);
};

export default UserTabs;
