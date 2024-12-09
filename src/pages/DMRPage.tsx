import { Page } from "../App.tsx";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import { DatapackInfoComponent } from "../components/DatapackInfoComponent.tsx";
import { DragonListComponent } from "../components/DragonListComponent.tsx";
import { DragonFieldComponent } from "../components/DragonFieldComponent.tsx";
import {
	Button,
	Container,
	FileInputWithTextField,
	IndentedBox,
} from "../app/StyledProps.tsx";
import { FormInput, SectionAccordion, useForm } from "../app/Form.tsx";
import { Armor, Dragon, Mode } from "../types/DMRTypes";
import { saveDatapack } from "../generation/DMRPackGeneration.ts";
import styled from "styled-components";

const DMRPage = ({
	versions,
	fields,
	markedForSave,
	setMarkedForSave,
}: Page) => {
	const [selectedVersion, setSelectedVersion] = useState<string>("");

	const [datapackName, setDatapackName] = useState<string>("");
	const [datapackId, setDatapackId] = useState<string>("");

	const [mode, setMode] = useState<Mode>("dragon");

	const [items, setItems] = useState<string[]>([]);
	const [attributes, setAttributes] = useState<string[]>([]);
	const [damageTypes, setDamageTypes] = useState<string[]>([]);
	const [lootTables, setLootTables] = useState<string[]>([]);
	const [particles, setParticles] = useState<string[]>([]);
	const [soundEvents, setSoundEvents] = useState<string[]>([]);

	const form = useForm();

	useEffect(() => {
		if (markedForSave) {
			setMarkedForSave("");

			const isValid = form.validate();

			if (!isValid) {
				alert("Please fill out all required fields before saving.");
				return;
			}

			saveDatapack(markedForSave, dragons, datapackId, datapackName);
		}
	}, [markedForSave]);

	useEffect(() => {
		const fetchFiles = async () => {
			if (!selectedVersion) return;

			try {
				setItems(
					(await (
						await fetch(`generated/${selectedVersion}/items.json`)
					).json()) as string[]
				);

				setAttributes(
					(await (
						await fetch(`generated/${selectedVersion}/attributes.json`)
					).json()) as string[]
				);

				setDamageTypes(
					(await (
						await fetch(`generated/${selectedVersion}/damage_types.json`)
					).json()) as string[]
				);

				setLootTables(
					(await (
						await fetch(`generated/${selectedVersion}/loot_tables.json`)
					).json()) as string[]
				);

				setParticles(
					(await (
						await fetch(`generated/${selectedVersion}/particles.json`)
					).json()) as string[]
				);

				setSoundEvents(
					(await (
						await fetch(`generated/${selectedVersion}/sound_events.json`)
					).json()) as string[]
				);
			} catch (err: any) {
				console.error(err.message);
			}
		};
		fetchFiles();
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
				<DatapackInfoComponent
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
					<DragonListComponent
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
								const isConfirmed = window.confirm(
									"Are you sure you wish to delete this dragon?"
								);
								if (!isConfirmed) return;

								setDragons(dragons.filter((d) => d.id !== selectedDragon.id));
								setSelectedDragon(null);
							}}
							style={{
								backgroundColor: "indianred",
								color: "white",
								borderRadius: "0.5rem",
								padding: "0.5rem",
								marginBottom: "20px",
								fontSize: "16px",
								cursor: "pointer",
								border: "1px solid #282c34",
							}}
						>
							Delete
						</Button>
						<ValueFieldSection
							sx={{
								gap: 1,
								height: "100%",
							}}
						>
							<SectionAccordion defaultExpanded title="Info">
								<ValueFieldSection
									// @ts-expect-error Stuff
									component="form"
									sx={{
										gap: 6,
									}}
								>
									<FormInput
										type="text"
										label="Name"
										name="name"
										value={selectedDragon.name}
										required={true}
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
								</ValueFieldSection>
							</SectionAccordion>

							<SectionAccordion title="Model/Animations">
								<ValueFieldSection
									// @ts-expect-error Stuff
									component="form"
									sx={{
										gap: 6,
									}}
								>
									<FileInputWithTextField
										label="Model"
										fileTypes=".json"
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
										fileTypes=".json"
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
								</ValueFieldSection>
							</SectionAccordion>

							<SectionAccordion defaultExpanded title="Textures">
								<ValueFieldSection
									// @ts-expect-error Stuff
									component="form"
									sx={{
										gap: 6,
									}}
								>
									<FileInputWithTextField
										label="Skin texture"
										fileTypes=".png,.jpg,.jpeg"
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
										fileTypes=".png,.jpg,.jpeg"
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
										fileTypes=".png,.jpg,.jpeg"
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
								</ValueFieldSection>
							</SectionAccordion>

							<SectionAccordion title="Fields/Values">
								<ValueFieldSection
									// @ts-expect-error Stuff
									component="form"
									sx={{
										gap: 6,
									}}
								>
									{selectedVersion &&
										fields
											.filter((s) => s.version === selectedVersion)
											.flatMap((s) => s.dragonFields)
											.map((field) => (
												<DragonFieldComponent
													key={field.name}
													field={field}
													selectedDragon={selectedDragon}
													dragons={dragons}
													setDragons={setDragons}
													setSelectedDragon={setSelectedDragon}
													items={items}
													attributes={attributes}
													damageTypes={damageTypes}
													lootTables={lootTables}
													particles={particles}
													soundEvents={soundEvents}
												/>
											))}
								</ValueFieldSection>
							</SectionAccordion>
						</ValueFieldSection>
					</Container>
				)}
			</Box>
		</>
	);
};

export const FieldsSection = styled(Box)`
	${IndentedBox};
	display: flex;
	flex-direction: column;
	padding: 20px;
	overflow-y: scroll;
`;

const ValueFieldSection = styled(FieldsSection)`
	padding-bottom: 40px;
`;

export default DMRPage;
