import styled from "styled-components";
import { Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Button, Container, Title } from "../app/StyledProps.tsx";
import { Dragon } from "../types/DMRTypes";

export function DragonListComponent({
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
							name: "",
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
							key={dragon.id}
							type="button"
							$isSelected={selectedDragon?.id === dragon.id}
							onClick={() => {
								setSelectedDragon(dragon);
							}}
						>
							{dragon.name !== "" ? dragon.name : "Unnamed Dragon"}
						</DragonButton>
					))}
			</Box>
		</Container>
	);
}

export const DragonButton = styled(Button)<{ $isSelected: boolean }>`
	background-color: ${(props) => (props.$isSelected ? "#4caf50" : "#255826")};
	color: ${(props) => ((props as any["$isSelected"]) ? "white" : "black")};

	border-color: ${(props) => (props.$isSelected ? "#4caf50" : "transparent")};
	border-radius: 0.5rem;
	transition: all 0.3s;
	font-weight: ${(props) => (props.$isSelected ? "bold" : "normal")};

	&:hover {
		background-color: ${(props) => (props.$isSelected ? "#45a049" : "#e0e0e0")};
	}
`;
