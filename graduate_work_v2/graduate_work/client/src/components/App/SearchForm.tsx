import { Button, Spacer } from "@nextui-org/react";
import { SlidersHorizontal, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchI } from "./Search";

import { Input } from "@nextui-org/input";

interface SearchFormI extends SearchI {
	//searchRef: React.RefObject<HTMLInputElement>;
	isLoading: boolean;
	isMobile: boolean;
	placeholderTxt: string;
	filterTxt: string;
	setSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchForm: React.FC<SearchFormI> = ({
	//searchRef,
	isLoading,
	isMobile,
	placeholderTxt,
	filterTxt,
	search,
	setSearch,
	setSelected,
}) => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-row justify-center z-0 items-center text-white w-[95vw] sm:w-[50vw] ">
			<div className="w-full">
				<Input
					color="primary"
					required
					isRequired={true}
					isReadOnly={isLoading}
					isDisabled={isLoading}
					variant="flat"
					//size="lg"
					className="text-center text-white "
					classNames={{
						inputWrapper: "bg-background/40 h-[56px] dark:bg-default/40",
					}}
					startContent={
						<div onClick={() => navigate("/filter?sort=popularity&type=multi")}>
							{isMobile ? (
								<Button
									isIconOnly
									isLoading={isLoading}
									isDisabled={isLoading}
									onClick={() => navigate("/filter?sort=popularity&type=multi")}
									radius="full"
									variant="flat"
									color="primary"
									className="ml-[-10px] mr-3 text-white font-bold"
								>
									<SlidersHorizontal size={16} />
								</Button>
							) : (
								<Button
									isLoading={isLoading}
									isDisabled={isLoading}
									onClick={() => navigate("/filter?sort=popularity&type=multi")}
									radius="full"
									color="primary"
									variant={`flat`}
									startContent={<SlidersHorizontal size={16} />}
									className=" text-white font-bold"
								>
									{filterTxt}
								</Button>
							)}
						</div>
					}
					placeholder={placeholderTxt}
					radius="full"
					value={search}
					onChange={(e) => {
						if (e.target.value.length > 3) {
							setSelected(true);
							setSearch(e.target.value);
						} else {
							setSearch(e.target.value);
						}
					}}
					onClear={() => setSearch("")}
				/>
			</div>
			<Spacer x={2} />
			<Button
				className="text-white"
				type="submit"
				color="primary"
				size="lg"
				isIconOnly
				isLoading={isLoading}
				isDisabled={isLoading}
				variant={`flat`}
				radius="full"
				aria-label="search movies or tv series"
				spinner={
					isLoading ? (
						<svg
							className="animate-spin h-5 w-5 text-current"
							fill="none"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								fill="currentColor"
							/>
						</svg>
					) : (
						<></>
					)
				}
			>
				{isLoading ? "Loading..." : <Search />}
			</Button>
		</div>
	);
};

export default SearchForm;
