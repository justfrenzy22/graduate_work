import { Button } from "@nextui-org/react";
import { Check } from "lucide-react";

interface ChipBtnProps {
	value: string;
	onClick: () => void;
	is: boolean;
}

const ChipBtn = ({ value, onClick, is }: ChipBtnProps) => {
	return (
			<Button 
            size="sm"
            radius="full"
            onClick={onClick}
			startContent={is ? <Check size={14} /> : null}
            color={is ? "primary" : "default"}
            variant={is ? 'shadow' : 'faded'}
			className="cursor-pointer"
            >{value}</Button>
		// </Chip>
	);
};

export default ChipBtn;
