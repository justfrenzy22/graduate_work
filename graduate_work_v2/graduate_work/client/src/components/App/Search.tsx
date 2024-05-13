import React, { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextTypes } from '../../utils/AppContext';
import { useNavigate } from 'react-router-dom';
import { mediaType } from './props.interface';
import toast, { Toaster } from 'react-hot-toast';
import SearchForm from './SearchForm';
import { QuickSearch, ToggleLikedFunc } from './handleFunctions';
import SearchSuggestions from './SearchSuggestions';

export interface SearchI {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export interface mediaTypeCheck extends mediaType {
	check: boolean;
}

const SearchComp: React.FC<SearchI> = (props) => {
	const { search, setSearch } = props;

	const { defaultLanguage, theme, systemTheme, isMobile, accessToken } =
		React.useContext<AppContextTypes>(AppContext);

	const navigate = useNavigate();

	const [selected, setSelected] = useState(false);
	const [data, setData] = useState([] as mediaType[] | []);

	const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
		null
	);
	const [isLoading, setLoading] = useState<boolean>(false);

	const { searchRef } = useContext<AppContextTypes>(AppContext);
	const [isDisabled, setDisabled] = useState(false);

	const {
		filterTxt,
		placeholderTxt,
	}: { filterTxt: string; placeholderTxt: string } =
		defaultLanguage === 'en-US' ? SearchText.en : SearchText.bg;

	useEffect(() => {
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}

		if (search.length > 3) {
			const handleKeyword = async () => {
				const response = await QuickSearch(search, defaultLanguage);
				if (response.status === 200) {
					setData(response.media as unknown as mediaTypeCheck[]);
				}
				console.log(`response`, response);
			};

			const timeoutId = setTimeout(() => {
				setLoading(true);
				console.log(`true`);
				console.log('Stopped typing:', search);
				handleKeyword();
				console.log(`idk if its not working`);
				setLoading(false);
			}, 500);

			// Storing the timeout ID for possible cancellation
			setTypingTimeout(timeoutId);

			// Event listener to handle clicks outside of the search component
			const handleClickOutside = (e: { target: unknown }) => {
				if (
					searchRef.current &&
					!searchRef.current.contains(e.target)
				) {
					setSelected(false);
				} else {
					setSelected(true);
				}
			};
			// Adding the event listener to the document body
			document.body.addEventListener(`click`, handleClickOutside);
		} else {
			// If the search term is not long enough, clear the data
			setData([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, defaultLanguage, searchRef, accessToken]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && selected) {
				setSelected(false);
			}
		};

		// Add event listener when component mounts
		document.addEventListener('keydown', handleEscape);

		// Clean up the event listener when component unmounts
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [selected]);

	// Function to handle the submission of the search form
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const form = e.target as HTMLFormElement;
		const searchVal = form.elements[1] as HTMLInputElement;
		if (searchVal?.value !== '' && searchVal?.value?.length > 3) {
			navigate(
				`/filter?keyword=${search.split(' ').join('+')}&sort=popularity&type=multi`
			);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type fnType = (...args: any[]) => void;

	const debounce = (fn: fnType, delay: number): fnType => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (...args: any[]) => {
			if (!isDisabled) {
				setDisabled(true);
				fn(...args);
				setTimeout(() => {
					setDisabled(false);
				}, delay);
			}
		};
	};

	const toggleLiked = async (mediaId: number, media: 'movie' | 'tv') => {
		if (media === 'movie' || media === 'tv') {
			const response = await ToggleLikedFunc(
				mediaId,
				media,
				defaultLanguage
			);
			const themeKey: AppContextTypes['theme'] =
				theme === 'system' ? (systemTheme ? 'dark' : 'light') : theme;
			if (response.status === 200) {
				const index = data.findIndex((item) => item.id === mediaId);

				if (index !== -1) {
					const newData = [...data];
					newData[index] = {
						...newData[index],
						check: !newData[index].check,
					};
					setData(newData);
				}
				toast.success(`${response.message}`, {
					style: {
						background: `${themeKey ? '#2a2a2a5d' : '#ffffffe9'} `,
						borderRadius: '30px',
						color: `${themeKey === `dark` ? '#fff' : '#fff'}`,
					},
					iconTheme: {
						primary: `#452fde`,
						secondary: `#fff`,
					},
				});
			} else {
				toast.success(`${response.message}`, {
					style: {
						background: `${themeKey ? '#2a2a2a5d' : '#ffffffe9'} `,
						borderRadius: '30px',
						color: `${themeKey === `dark` ? '#fff' : '#fff'}`,
					},
					iconTheme: {
						primary: `#452fde`,
						secondary: `#fff`,
					},
				});
			}
		}
	};

	const handleClicked = debounce(toggleLiked, 2000);

	// The render method returns the JSX for the search component
	return (
		<form
			ref={searchRef}
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit(e);
			}}
		>
			{/* The search component container */}
			<SearchForm
				filterTxt={filterTxt}
				placeholderTxt={placeholderTxt}
				isLoading={isLoading}
				isMobile={isMobile}
				search={search}
				setSearch={setSearch}
				//searchRef={searchRef}
				setSelected={setSelected}
			/>
			<SearchSuggestions
				data={data}
				selected={selected}
				search={search}
				handleClicked={handleClicked}
				isLoading={isLoading}
			/>

			<Toaster position="top-right" />

			<></>
		</form>
	);
};

export default SearchComp;

const SearchText = {
	bg: {
		filterTxt: 'Филтър',
		placeholderTxt: 'Търси',
	} as { filterTxt: string; placeholderTxt: string },
	en: {
		filterTxt: 'Filter',
		placeholderTxt: 'Search',
	} as { filterTxt: string; placeholderTxt: string },
};
