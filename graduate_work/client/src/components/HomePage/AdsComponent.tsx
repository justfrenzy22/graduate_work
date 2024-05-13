import { Card, CardBody, CardFooter } from "@nextui-org/react";

const AdsComponent: React.FC = (): JSX.Element => {
	return (
		<div className="flex flex-col justify-between gap-3 py-4 min-w-[200px]">
			{Array.from({ length: 6 }).map((_, idx: number) => (
				<Card key={idx} isPressable >
					<CardBody>
						{Array.from({ length: 2 }).map((_, idx: number) => (
							<p key={idx}>Ad from Google</p>
						))}
					</CardBody>
					<CardFooter>
						{Array.from({ length: 2 }).map((_, idx: number) => (
							<p key={idx}>Google Ad footer</p>
						))}
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default AdsComponent;
