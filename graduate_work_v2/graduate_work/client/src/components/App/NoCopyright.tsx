import { useContext } from 'react';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import NoCopyrightText from './NoCopyrightText';

const NoCopyright = () => {
	const { defaultLanguage } = useContext<AppContextTypes>(AppContext);

	const { noCopyRight } =
		defaultLanguage === 'bg-BG'
			? (NoCopyrightText.bg as { noCopyRight: string })
			: (NoCopyrightText.en as { noCopyRight: string });

	return (
		<>
			<p>{noCopyRight}</p>
		</>
	);
};

export default NoCopyright;
