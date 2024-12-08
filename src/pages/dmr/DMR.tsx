import { Page } from "../../App.tsx";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import JSZip from "jszip";

import { DatapackInfo } from "./DatapackInfo.tsx";
import { DragonList } from "./DragonList.tsx";
import { DragonFields } from "./DragonFields.tsx";
import {
	Button,
	Container,
	FileInputWithTextField,
} from "../../StyledProps.tsx";
import { FormInput, SectionAccordion, useForm } from "../../Form.tsx";
import { Armor, Dragon, DragonFieldTypes, Mode } from "../../Types.ts";

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

			if (markedForSave === "zip") {
				const zip = new JSZip();
				const resourceZip = new JSZip();
				const dataZip = new JSZip();

				const lang: { [key: string]: string } = {};

				// Add dragons to zip
				dragons.forEach((dragon) => {
					const dragonId = dragon.name!.toLowerCase().replace(/ /g, "_");
					const name = dragon.name!;

					if (dragon.model) {
						resourceZip.file(
							`assets/${datapackId}/geo/${dragonId}.json`,
							dragon.model
						);
					}

					if (dragon.animation) {
						resourceZip.file(
							`assets/${datapackId}/animations/${dragonId}.animation.json`,
							dragon.animation
						);
					}

					resourceZip.file(
						`assets/${datapackId}/textures/entity/dragon/${dragonId}/body.png`,
						dragon.texture
					);

					if (dragon.saddleTexture) {
						resourceZip.file(
							`assets/${datapackId}/textures/entity/dragon/${dragonId}/saddle.png`,
							dragon.saddleTexture
						);
					}

					if (dragon.glowTexture) {
						resourceZip.file(
							`assets/${datapackId}/textures/entity/dragon/${dragonId}/glow.png`,
							dragon.glowTexture
						);
					}

					lang[`${datapackId}.dragon_breed.${dragonId}`] = `${name} Dragon`;
					lang[`item.${datapackId}.dragon_spawn_egg.${dragonId}`] =
						`${name} Dragon Spawn Egg`;
					lang[`block.${datapackId}.dragon_egg.${dragonId}`] =
						`${name} Dragon Egg`;

					const get = <T,>(
						accessor: (fields: DragonFieldTypes) => T | undefined
					): T | undefined => {
						return dragon.fields ? accessor(dragon.fields) : undefined;
					};

					const getAndDo = <T,>(
						accessor: (fields: DragonFieldTypes) => T | undefined,
						perform: (value: T) => T
					): T | undefined => {
						const value = get(accessor);
						return value ? perform(value) : undefined;
					};

					const data: Partial<
						Record<
							keyof DragonFieldTypes | "model_location" | "animation_location",
							any
						>
					> = {
						...dragon.fields,
						model_location: dragon.model
							? `${datapackId}:geo/${dragonId}.json`
							: undefined,
						animation_location: dragon.animation
							? `${datapackId}:animations/${dragonId}.animation.json`
							: undefined,
						//TODO Add chance to loot tables
						loot_tables: getAndDo(
							(d) => d.loot_tables,
							(d) =>
								d.map((item: string) => {
									return { table: item, min: 1, max: 1, chance: 0.1 };
								})
						),
					};

					dataZip.file(
						`data/${datapackId}/dmr/breeds/${dragonId}.json`,
						JSON.stringify(data, null, 2)
					);
				});

				resourceZip.file(
					`assets/${datapackId}/lang/en_us.json`,
					JSON.stringify(lang, null, 2)
				);

				resourceZip.file(
					`pack.mcmeta`,
					JSON.stringify(
						{
							pack: {
								pack_format: "22",
								description: `Textures for ${datapackName}`,
							},
						},
						null,
						2
					)
				);

				const generatePack = async () => {
					zip.file(
						`${datapackId} - Resource Pack.zip`,
						await resourceZip.generateAsync({ type: "blob" })
					);
					zip.file(
						`${datapackId} - Data Pack.zip`,
						await dataZip.generateAsync({ type: "blob" })
					);

					const zipBlob = await zip.generateAsync({ type: "blob" });

					// Trigger download
					const url = URL.createObjectURL(zipBlob);
					const link = document.createElement("a");
					link.href = url;
					link.download = `${datapackName} - Bundled.zip`;
					link.click();

					// Clean up
					URL.revokeObjectURL(url);
				};

				generatePack();
			}
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

						<SectionAccordion defaultExpanded title="Info">
							<Box
								component="form"
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 6,
									paddingBottom: "40px",
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
							</Box>
						</SectionAccordion>

						<SectionAccordion title="Model/Animations">
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
							</Box>
						</SectionAccordion>

						<SectionAccordion defaultExpanded title="Textures">
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
							</Box>
						</SectionAccordion>

						<SectionAccordion title="Fields/Values">
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
										.map((field) => (
											<DragonFields
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
							</Box>
						</SectionAccordion>
					</Container>
				)}
			</Box>
		</>
	);
};

export default DMRPage;
