import styled from "styled-components";
import { Button, Container, Title } from "../../App.tsx";
import { Box } from "@mui/material";
import { Dragon } from "./DMR.tsx";
import { v4 as uuidv4 } from "uuid";

export function DragonList({
	dragons,
	setDragons,
	selectedDragon,
	setSelectedDragon,
}: {
	dragons: Dragon[];
	setDragons: (dragons: Dragon[]) => void;
	selectedDragon: Dragon | null;
	setSelectedDragon: (dragon: Dragon) => void;
}) {
	return (
		<Container
			key="dragons"
			style={{ flex: "0 1 300px", maxHeight: "75vh", height: "75vh" }}
		>
			<Title>Dragons</Title>
			<Box
				component="form"
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					padding: "10px",
					overflowY: "scroll",
				}}
			>
				<Button
					key="newDragon"
					type="button"
					onClick={() => {
						let newDragon: Dragon = {
							name: `Dragon${dragons.length + 1}`,
							id: uuidv4(),
						};
						setDragons([...dragons, newDragon]);
						setSelectedDragon(newDragon);
					}}
				>
					[Add new dragon]
				</Button>

				{dragons &&
					dragons.map((dragon) => (
						<DragonButton
							key={dragon.name}
							type="button"
							// @ts-expect-error Stuff
							$isSelected={(selectedDragon === dragon).toString()}
							onClick={() => {
								setSelectedDragon(dragon);
							}}
						>
							{dragon.name}
						</DragonButton>
					))}
			</Box>
		</Container>
	);
}

export const DragonButton = styled(Button)`
	background-color: ${(props) =>
		(props as any["$isSelected"]) ? "#4caf50" : "#255826"};
	color: ${(props) => ((props as any["$isSelected"]) ? "white" : "black")};

	border-color: ${(props) =>
		(props as any["$isSelected"]) ? "#4caf50" : "transparent"};
	border-radius: 0.5rem;
	transition: all 0.3s;
	font-weight: ${(props) =>
		(props as any["$isSelected"]) ? "bold" : "normal"};

	&:hover {
		background-color: ${(props) =>
			(props as any["$isSelected"]) ? "#45a049" : "#e0e0e0"};
	}
`;
