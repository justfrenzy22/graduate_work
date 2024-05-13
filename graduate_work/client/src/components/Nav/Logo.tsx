import { useContext, useMemo } from "react";
import { AppContext, AppContextTypes } from "../../utils/AppContext";

const Logo = ({
	fill = "none",
	color = "currentColor",
	size = 24,
	strokeWidth = 1.5,
	...props
}) => {
	const { theme, systemTheme } =
		useContext<AppContextTypes>(AppContext);

	const fillColor = useMemo(() => {
		const themeKey = theme === 'system' ? (systemTheme ? 'dark' : 'light') : theme;
		return themeKey === 'dark' ? '#fff' : '#000';
	}, [theme, systemTheme]);

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 697 768"
			width={size}
			height={size}
			strokeWidth={strokeWidth}
			stroke={color}
			fill={fill}
			{...props}
		>
			<style type="text/css">{`.st0{fill:${fillColor};}`}</style>
			<g>
				<path
					className="st0"
					d="M148.07,515.52c0-23.16-0.1-46.32,0.02-69.48c0.18-36.01,37.75-58.69,69.14-41.11
          c41.06,23,81.82,46.55,122.3,70.56c30.43,18.05,30.96,61.42,0.66,79.64c-40.78,24.53-81.99,48.4-123.67,71.35
          c-31.27,17.22-68.23-5.77-68.43-41.48C147.97,561.85,148.07,538.68,148.07,515.52z"
				/>
				<path
					className="st0"
					d="M148.07,249.13c0-22.89-0.07-45.79,0.02-68.68c0.15-36.99,38.01-59.47,70.14-41.27
          c40.49,22.93,80.83,46.14,120.91,69.77c31.39,18.51,31.04,62.55-0.48,81.04c-39.68,23.27-79.52,46.28-119.47,69.09
          c-32.97,18.83-71.01-3.38-71.11-41.26C148.02,294.92,148.07,272.03,148.07,249.13z"
				/>
				<path
					className="st0"
					d="M379.74,382.44c0-22.89-0.03-45.79,0.01-68.68c0.06-37.44,37.7-59.65,70.5-41.25
          c28.75,16.13,57.15,32.89,85.7,49.38c11.28,6.51,22.64,12.91,33.85,19.54c32.23,19.08,32.31,63.1-0.04,82
          c-39.26,22.94-78.91,45.2-118.04,68.34c-34.1,20.17-74.06-5.47-72.19-42.26C380.67,427.21,379.74,404.81,379.74,382.44z"
				/>
			</g>
		</svg>
	);
};

export default Logo;