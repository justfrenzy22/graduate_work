import { useContext } from 'react';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import NoCopyright from './NoCopyright';
import { Image, Link } from '@nextui-org/react';

const Footer = () => {
	const { theme, themeStyle, systemTheme } =
		useContext<AppContextTypes>(AppContext);

	const themeKey: AppContextTypes['theme'] =
		theme === 'system' ? (systemTheme ? 'dark' : 'light') : theme;

	return (
		<>
			<div
				className={`bg-gradient-to-bl  ${themeStyle[themeKey as keyof typeof themeStyle]} `}
			>
				<div className="flex justify-center items-center flex-col gap-2 p-2">
					<div className="flex justify-center items-center flex-col w-full">
						<a>CrackFlix</a>
						<p>
							<p>
								© {new Date().getFullYear()} CrackFlix. All
								rights reserved.
							</p>
							<br />
							<Link
								href="//www.dmca.com/Protection/Status.aspx?ID=76f2a507-2f2f-4315-9fcb-41980395124e"
								title="DMCA.com Protection Status"
								target="_blank"
								className="dmca-badge"
							>
								<Image
									src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png?ID=76f2a507-2f2f-4315-9fcb-41980395124e"
									alt="DMCA.com Protection Status"
								/>
							</Link>

							<br />
							<Link className='cursor-pointer' href='/'>CrackFlix</Link>
						</p>
					</div>
					<NoCopyright />
				</div>
			</div>
		</>
	);
};

export default Footer;
