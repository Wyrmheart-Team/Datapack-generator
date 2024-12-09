import styled from "styled-components";
import { Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Button, Container, RaisedBox, Title } from "../app/StyledProps.tsx";
import { Dragon } from "../types/DMRTypes";
import { FieldsSection } from "../pages/DMRPage.tsx";

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
			<FieldsSection
				// @ts-expect-error Stuff
				component="form"
				sx={{
					gap: 2,
				}}
				style={{
					height: "100%",
				}}
			>
				<NewDragonButton
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
				</NewDragonButton>

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
			</FieldsSection>
		</Container>
	);
}

const NewDragonButton = styled(Button)`
	${RaisedBox};
	background-color: #3f51b5;
	color: white;
	border-radius: 0.5rem;
	transition: all 0.3s;

	&:hover {
		background-color: #303f9f;
	}
`;

export const DragonButton = styled(Button)<{ $isSelected: boolean }>`
	${RaisedBox};
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
