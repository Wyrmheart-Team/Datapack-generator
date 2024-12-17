import styled from "styled-components";
import { Button } from "../app/StyledProps.tsx";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	MenuItem,
	Select,
	Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import { BaseObjectProp } from "../types/DMRTypes";

type ObjectListComponentProps = {
	versions: string[];
	selectedVersion: string;
	setSelectedVersion: (version: string) => void;

	addNewObject: (category: string) => BaseObjectProp;
	removeObject: (category: string, object: BaseObjectProp) => void;
	objects: { [key: string]: BaseObjectProp[] };
	selectedObject: string | null;
	setSelectedObject: (category: string, object: BaseObjectProp) => void;
	defaultName: (category: string) => string;
	title: (category: string) => string;
	clearData: () => void;
	openSettings: () => void;
	saveData: () => void;
	setMarkedForSave: (type: string) => void;
};

export function ObjectListComponent({
	versions,
	selectedVersion,
	setSelectedVersion,
	addNewObject,
	removeObject,
	objects,
	selectedObject,
	setSelectedObject,
	defaultName,
	title,
	clearData,
	openSettings,
	saveData,
	setMarkedForSave,
}: ObjectListComponentProps) {
	return (
		<ObjectList
			key="objects"
			style={{
				flex: "0 1 250px",
			}}
		>
			<Toolbar>
				<Tooltip title="Minecraft version" arrow placement="top">
					{versions && (
						<VersionField
							value={selectedVersion ?? versions[0]}
							onChange={(event) => {
								let targetVersion = event.target.value as string;
								if (targetVersion !== selectedVersion) {
									if (
										!window.confirm(
											"Are you sure you want to change versions? All unsaved changes will be lost."
										)
									) {
										return;
									}
									clearData();
									setSelectedVersion(event.target.value as string);
								}
							}}
						>
							{versions.reverse().map((version: string) => (
								<MenuItem value={version} key={version}>
									{version}
								</MenuItem>
							))}
						</VersionField>
					)}
				</Tooltip>
				<Tooltip title="Save" arrow placement="top">
					<SaveButton
						type="button"
						onClick={() => saveData()}
						displayEmpty
						renderValue={() => (
							<SaveAsIcon style={{ transform: "translateX(50%)" }} />
						)}
					>
						<MenuItem onClick={() => setMarkedForSave("mod")}>
							Save as Mod
						</MenuItem>
						<MenuItem onClick={() => setMarkedForSave("zip")}>
							Save as Zip
						</MenuItem>
					</SaveButton>
				</Tooltip>
				<Tooltip title="Settings" arrow placement="top">
					<SettingsButton type="button" onClick={() => openSettings()}>
						<SettingsIcon />
					</SettingsButton>
				</Tooltip>
			</Toolbar>
			<ObjectListBox
				// @ts-expect-error Stuff
				component="form"
			>
				{objects &&
					Object.keys(objects).map((category) => (
						<ObjectListAccordian key={category} defaultExpanded>
							<AccordianContainer>
								<ObjectListAccordianSummary
									expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
								>
									<b style={{ color: "white" }}>{title(category)}</b>

									<Tooltip title="Add new" arrow>
										<AddObjectButton
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												addNewObject(category);
											}}
										>
											+
										</AddObjectButton>
									</Tooltip>
								</ObjectListAccordianSummary>
							</AccordianContainer>
							<ObjectListAccordianDetails>
								{objects[category].map((object) => (
									<ObjectRow key={object.id}>
										<ObjectButton
											type="button"
											$isSelected={selectedObject === object.id}
											onClick={() => setSelectedObject(category, object)}
										>
											{selectedObject === object.id ? (
												<TurnedInIcon
													style={{
														transform: "translateX(-50%) translateY(25%)",
													}}
												/>
											) : (
												<TurnedInNotIcon
													style={{
														transform: "translateX(-50%) translateY(25%)",
													}}
												/>
											)}
											{object.name !== "" ? object.name : defaultName(category)}
										</ObjectButton>
										<Tooltip title="Remove" arrow>
											<RemoveObjectButton
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													removeObject(category, object);
												}}
											>
												<DeleteForeverIcon />
											</RemoveObjectButton>
										</Tooltip>
									</ObjectRow>
								))}
							</ObjectListAccordianDetails>
						</ObjectListAccordian>
					))}
			</ObjectListBox>
		</ObjectList>
	);
}

const Toolbar = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	background: #212127;
	height: 55px;
	min-width: 250px;
`;

const Btn = styled(Button)`
	color: white;
	border-radius: 0;
	transition: all 0.3s;
	font-weight: bold;
	height: 100%;
	background: none;
	z-index: 1;
	pointer-events: auto;
	text-align: center;
	aspect-ratio: 1;

	&:hover {
		background: #3b49b2 !important;
	}
`;

const SettingsButton = styled(Btn)``;

const SaveButton = styled(Select)`
	color: white;
	border-radius: 0 !important;
	transition: all 0.3s;
	font-weight: bold;
	height: 100%;
	background: none;
	z-index: 1;
	pointer-events: auto;
	text-align: center;
	aspect-ratio: 1 !important;

	&:hover {
		background: #3b49b2 !important;
	}

	& .MuiSelect-icon,
	& .MuiSelect-select {
		color: white;
		padding: 0;
	}

	& .MuiOutlinedInput-notchedOutline {
		border: none;
	}

	& [data-testid="ArrowDropDownIcon"] {
		display: none;
	}
`;

const ClearAllButton = styled(Btn)``;

const VersionField = styled(Select)`
	height: 100%;
	border-radius: 0;
	font-size: 16px;
	width: 100%;

	& .MuiSelect-icon,
	& .MuiSelect-select {
		color: white;
	}

	& .MuiOutlinedInput-notchedOutline {
		border: none;
	}
`;

const ObjectRow = styled.div`
	display: flex;
	flex-direction: row;
`;

const AddObjectButton = styled(Button)`
	position: absolute;
	right: 50px;
	top: 0;
	color: white;
	border-radius: 0;
	transition: all 0.3s;
	font-weight: bold;
	height: 100%;
	aspect-ratio: 1;
	background: none;
	z-index: 1;
	pointer-events: auto;
	text-align: center;

	&:hover {
		background: seagreen !important;
	}
`;

const RemoveObjectButton = styled(Button)`
	color: white;
	border-radius: 0;
	transition: all 0.3s;
	font-weight: bold;
	background: none;
	z-index: 1;
	pointer-events: auto;
	height: 40px;
	aspect-ratio: 1;
	position: relative;
	padding: 6px;
	background: #2c3039 !important;
	&:hover {
		background: indianred !important;
	}
`;

const ObjectListAccordian = styled(Accordion)`
	border-radius: 0;
	width: 100%;
	padding: 0;
	margin: 0;
`;

const AccordianContainer = styled.div`
	background: #2c3039 !important;

	&:hover {
		background: #303f9f !important;
	}

	.Mui-expanded {
		margin: 0;
		min-height: 0 !important;
	}
`;

const ObjectListAccordianSummary = styled(AccordionSummary)`
	&& {
		display: flex;
		justify-content: space-between;
		padding: 0 1rem 0 0;

		b {
			padding-left: 1rem;
		}

		.Mui-expanded {
			margin-bottom: 12px;
			margin-top: 12px;
		}
	}
`;

const ObjectListAccordianDetails = styled(AccordionDetails)`
	&& {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		padding: 0;
		background: #282c34 !important;
	}
`;

const ObjectListBox = styled(Box)`
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	height: 100%;
	padding: 0;
	border-radius: 0;
	box-shadow: 10px 0 5px rgba(0, 0, 0, 0.1);
`;

const ObjectList = styled.div`
	display: flex;
	flex-direction: column;
	background-color: #282c34;
	width: 100%;
`;

export const ObjectButton = styled(Button)<{ $isSelected: boolean }>`
	width: 100%;
	padding: 0;
	font-weight: ${(props) => (props.$isSelected ? "bold" : "normal")};
	background-color: ${(props) => (props.$isSelected ? "none" : "#2c3039")};
	color: white;
	border-radius: 0;
	transition: all 0.3s;
	line-height: 40px;

	&:hover {
		background-color: gray;
	}
`;
