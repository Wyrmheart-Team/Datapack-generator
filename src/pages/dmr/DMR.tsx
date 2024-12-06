import {
	Button,
	ColorField,
	Container,
	FieldProp,
	FileInputWithTextField,
	InputField,
	Page,
	Title,
	TransparentAccordion,
} from "../../App.tsx";
import {
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Box,
	IconButton,
	InputAdornment,
	Tooltip,
} from "@mui/material";
import { JSX, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { matchIsValidColor } from "mui-color-input";
import { DatapackInfo } from "./DatapackInfo.tsx";
import { DragonList } from "./DragonList.tsx";
import { dragonFields } from "./DragonFields.tsx";

export type Dragon = {
	name: string;
	id: string;
	texture?: File;
	glowTexture?: File;
	saddleTexture?: File;
	model?: File;
	animation?: File;
	fields?: {
		[key: string]: string;
	};
};

export type Armor = {
	name: string;
};

export type Mode = "dragon" | "armor";

const DMRPage = ({ versions, fields }: Page) => {
	const [selectedVersion, setSelectedVersion] = useState<string>("");

	const [datapackName, setDatapackName] = useState<string>("");
	const [datapackId, setDatapackId] = useState<string>("");

	const [mode, setMode] = useState<Mode>("dragon");

	const [items, setItems] = useState<string[]>([]);

	useEffect(() => {
		const fetchItems = async () => {
			if (!selectedVersion) return;

			try {
				const response = await fetch(`${selectedVersion}/en_us.json`);
				if (!response.ok) {
					throw new Error("Failed to fetch local lang file");
				}

				const data = await response.json();

				const items = Object.entries(data)
					.filter(
						([key]) =>
							key.startsWith("item.minecraft.") &&
							!key.includes("spawn_egg") &&
							!key.includes(".desc") &&
							!key.includes("firework") &&
							!key.includes("potion") &&
							!key.includes("tipped_arrow")
					)
					.map(([key]) => key.replace("item.minecraft.", "minecraft:"));

				const uniqueItems = Array.from(
					new Map(items.map((item) => [item, item])).values()
				);

				setItems(uniqueItems);
			} catch (err: any) {
				console.error(err.message);
			}
		};
		fetchItems();
	}, [selectedVersion]);

	const [dragons, setDragons] = useState<Dragon[]>([]);
	const [armors, setArmors] = useState<Armor[]>([]);

	const [selectedDragon, setSelectedDragon] = useState<Dragon | null>(null);
	const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);

	useEffect(() => {
		if (!selectedVersion && versions) {
			setSelectedVersion(versions.reverse()[0]);
		}
	}, [versions]);

	return (
		<>
			<Box
				sx={{
					display: "flex",
				}}
			>
				<DatapackInfo
					versions={versions}
					selectedVersion={selectedVersion}
					setSelectedVersion={setSelectedVersion}
					dataPackName={datapackName}
					setDatapackName={setDatapackName}
					datapackId={datapackId}
					setDatapackId={setDatapackId}
					mode={mode}
					setMode={setMode}
				/>

				{mode === "dragon" && (
					<DragonList
						dragons={dragons}
						setDragons={setDragons}
						selectedDragon={selectedDragon}
						setSelectedDragon={setSelectedDragon}
					/>
				)}

				{mode === "dragon" && selectedDragon && (
					<Container
						style={{
							overflowY: "auto",
							flex: "1 0 auto",
							maxHeight: "75vh",
							height: "75vh",
						}}
					>
						<Button
							type="button"
							onClick={() => {
								setDragons(dragons.filter((d) => d.id !== selectedDragon.id));
								setSelectedDragon(null);
							}}
							style={{
								backgroundColor: "indianred",
								color: "white",
								border: "none",
								borderRadius: "0.5rem",
								padding: "0.5rem",
								fontSize: "16px",
								cursor: "pointer",
							}}
						>
							Delete
						</Button>

						<TransparentAccordion
							defaultExpanded
							sx={{
								backgroundColor: "#282c34",
								borderRadius: "15px",
								marginBottom: "20px",
							}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
							>
								<Title style={{ marginBottom: "0" }}>Info</Title>
							</AccordionSummary>
							<AccordionDetails>
								<Box
									component="form"
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: 6,
										paddingBottom: "40px",
									}}
								>
									<InputField
										type="text"
										label="Name"
										value={selectedDragon.name}
										required={true}
										FormHelperTextProps={{
											style: {
												color: "indianred",
												fontStyle: "italic",
											},
										}}
										helperText={" * This field is required"}
										onChange={(event) => {
											let dragon = dragons.find(
												(d) => d.id === selectedDragon.id
											)!;
											dragon!.name = event.target.value;

											setDragons(
												dragons.map((d) =>
													d.id === selectedDragon.id ? dragon : d
												)
											);
											setSelectedDragon(dragon);
										}}
									/>
								</Box>
							</AccordionDetails>
						</TransparentAccordion>

						<TransparentAccordion
							sx={{
								backgroundColor: "#282c34",
								borderRadius: "15px",
								marginBottom: "20px",
							}}
							defaultExpanded
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
							>
								<Title style={{ marginBottom: "0" }}>Model/Animations</Title>
							</AccordionSummary>
							<AccordionDetails>
								<Box
									component="form"
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: 6,
										padding: "10px",
										overflowY: "scroll",
										paddingBottom: "40px",
									}}
								>
									<FileInputWithTextField
										label="Model"
										onChange={(file) => {
											let dragon = dragons.find(
												(d) => d.id === selectedDragon.id
											)!;
											dragon.model = file;

											setDragons(
												dragons.map((d) =>
													d.id === selectedDragon.id ? dragon : d
												)
											);
											setSelectedDragon(dragon);
										}}
									/>
									<FileInputWithTextField
										label="Animation"
										onChange={(file) => {
											let dragon = dragons.find(
												(d) => d.id === selectedDragon.id
											)!;
											dragon.animation = file;

											setDragons(
												dragons.map((d) =>
													d.id === selectedDragon.id ? dragon : d
												)
											);
											setSelectedDragon(dragon);
										}}
									/>
								</Box>
							</AccordionDetails>
						</TransparentAccordion>

						<TransparentAccordion
							sx={{
								backgroundColor: "#282c34",
								borderRadius: "15px",
								marginBottom: "20px",
							}}
							defaultExpanded
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
							>
								<Title style={{ marginBottom: "0" }}>Textures</Title>
							</AccordionSummary>
							<AccordionDetails>
								<Box
									component="form"
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: 6,
										padding: "10px",
										overflowY: "scroll",
										paddingBottom: "40px",
									}}
								>
									<FileInputWithTextField
										label="Skin texture"
										required={true}
										onChange={(file) => {
											let dragon = dragons.find(
												(d) => d.id === selectedDragon.id
											)!;
											dragon.texture = file;

											setDragons(
												dragons.map((d) =>
													d.id === selectedDragon.id ? dragon : d
												)
											);
											setSelectedDragon(dragon);
										}}
									/>
									<FileInputWithTextField
										label="Saddle texture"
										onChange={(file) => {
											let dragon = dragons.find(
												(d) => d.id === selectedDragon.id
											)!;
											dragon.saddleTexture = file;

											setDragons(
												dragons.map((d) =>
													d.id === selectedDragon.id ? dragon : d
												)
											);
											setSelectedDragon(dragon);
										}}
									/>
									<FileInputWithTextField
										label="Glow texture"
										onChange={(file) => {
											let dragon = dragons.find(
												(d) => d.id === selectedDragon.id
											)!;
											dragon.glowTexture = file;

											setDragons(
												dragons.map((d) =>
													d.id === selectedDragon.id ? dragon : d
												)
											);
											setSelectedDragon(dragon);
										}}
									/>
								</Box>
							</AccordionDetails>
						</TransparentAccordion>

						<TransparentAccordion
							sx={{
								backgroundColor: "#282c34",
								borderRadius: "15px",
								marginBottom: "20px",
							}}
							defaultExpanded
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
							>
								<Title style={{ marginBottom: "0" }}>Fields</Title>
							</AccordionSummary>
							<AccordionDetails>
								<Box
									component="form"
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: 6,
										padding: "10px",
										overflowY: "scroll",
										paddingBottom: "40px",
									}}
								>
									{selectedVersion &&
										fields
											.filter((s) => s.version === selectedVersion)
											.flatMap((s) => s.dragonFields)
											.map((field) =>
												dragonFields(
													field,
													selectedDragon,
													dragons,
													setDragons,
													setSelectedDragon,
													items
												)
											)}
								</Box>
							</AccordionDetails>
						</TransparentAccordion>
					</Container>
				)}

				{/* {mode === "armor" && selectedArmor && ( */}
				{/* 	<Container */}
				{/* 		key="armorFields" */}
				{/* 		style={{ flex: "1 1 400px", maxHeight: "75vh", height: "75vh" }} */}
				{/* 	> */}
				{/* 		<Title>Fields</Title> */}
				{/* 		<Box */}
				{/* 			component="form" */}
				{/* 			sx={{ */}
				{/* 				display: "flex", */}
				{/* 				flexDirection: "column", */}
				{/* 				gap: 6, */}
				{/* 				padding: "10px", */}
				{/* 			}} */}
				{/* 		> */}
				{/* 			{selectedVersion && */}
				{/* 				fields */}
				{/* 					.filter((s) => s.version === selectedVersion) */}
				{/* 					.flatMap((s) => s.dragonFields) */}
				{/* 					.map((field) => dragonFields( */}
				{/* 						field, */}
				{/* 						selectedDragon, */}
				{/* 						dragons, */}
				{/* 						setDragons, */}
				{/* 						setSelectedDragon, */}
				{/* 						items */}
				{/* 					))} */}
				{/* 		</Box> */}
				{/* 	</Container> */}
				{/* )} */}
			</Box>
		</>
	);
};

export default DMRPage;
