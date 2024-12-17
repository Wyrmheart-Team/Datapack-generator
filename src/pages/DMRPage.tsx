import { Page } from "../App.tsx";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { ObjectListComponent } from "../components/ObjectListComponent.tsx";
import { FormInput, useForm } from "../app/Form.tsx";
import { Armor, BaseObjectProp, Dragon } from "../types/DMRTypes";
import { saveDatapack } from "../generation/DMRPackGeneration.ts";
import { ObjectInfoComponent } from "../components/ObjectInfoComponent.tsx";
import { loadInitialState, saveToLocalStorage } from "../app/Utils.ts";
import styled from "styled-components";
import { Button, Title } from "../app/StyledProps.tsx";
import CheckIcon from "@mui/icons-material/Check";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const DRAGONS_KEY = "dragons";
const ARMORS_KEY = "armors";

const DMRPage = ({
	versions,
	fields,
	markedForSave,
	setMarkedForSave,
}: Page) => {
	const [selectedVersion, setSelectedVersion] = useState<string>(() => {
		return loadInitialState<string>("selectedVersion", "");
	});

	const [datapackName, setDatapackName] = useState<string>(() =>
		loadInitialState<string>("datapackName", "")
	);
	const [datapackId, setDatapackId] = useState<string>(() =>
		loadInitialState<string>("datapackId", "")
	);

	const [showSettings, setShowSettings] = useState<boolean>(false);

	useEffect(() => {
		if (!datapackName && !showSettings) {
			setShowSettings(true);
		}
	}, [datapackName]);

	useEffect(() => {
		if (!datapackId && !showSettings) {
			setShowSettings(true);
		}
	}, [datapackId]);

	const [items, setItems] = useState<string[]>([]);
	const [attributes, setAttributes] = useState<string[]>([]);
	const [damageTypes, setDamageTypes] = useState<string[]>([]);
	const [lootTables, setLootTables] = useState<string[]>([]);
	const [particles, setParticles] = useState<string[]>([]);
	const [soundEvents, setSoundEvents] = useState<string[]>([]);

	const [dragons, setDragons] = useState<Dragon[]>(() =>
		loadInitialState<Dragon[]>(DRAGONS_KEY, [])
	);
	const [armors, setArmors] = useState<Armor[]>(() =>
		loadInitialState<Armor[]>(ARMORS_KEY, [])
	);

	const [selectedDragon, setSelectedDragon] = useState<string | null>(() => {
		return loadInitialState<string | null>("selectedDragonId", null);
	});
	const [selectedArmor, setSelectedArmor] = useState<string | null>(() => {
		return loadInitialState<string | null>("selectedArmorId", null);
	});

	// Save logic
	useEffect(() => {
		saveToLocalStorage("datapackName", datapackName);
	}, [datapackName]);

	useEffect(() => {
		saveToLocalStorage("datapackId", datapackId);
	}, [datapackId]);

	useEffect(() => {
		saveToLocalStorage("selectedVersion", selectedVersion);
	}, [selectedVersion]);

	useEffect(() => {
		saveToLocalStorage("selectedDragonId", selectedDragon ?? "");
	}, [selectedDragon]);

	useEffect(() => {
		saveToLocalStorage("selectedArmorId", selectedArmor ?? "");
	}, [selectedArmor]);

	useEffect(() => {
		saveToLocalStorage(DRAGONS_KEY, dragons);
	}, [dragons]);

	useEffect(() => {
		saveToLocalStorage(ARMORS_KEY, armors);
	}, [armors]);

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
						await fetch(
							`${import.meta.env.BASE_URL}generated/${selectedVersion}/items.json`
						)
					).json()) as string[]
				);

				setAttributes(
					(await (
						await fetch(
							`${import.meta.env.BASE_URL}generated/${selectedVersion}/attributes.json`
						)
					).json()) as string[]
				);

				setDamageTypes(
					(await (
						await fetch(
							`${import.meta.env.BASE_URL}generated/${selectedVersion}/damage_types.json`
						)
					).json()) as string[]
				);

				setLootTables(
					(await (
						await fetch(
							`${import.meta.env.BASE_URL}generated/${selectedVersion}/loot_tables.json`
						)
					).json()) as string[]
				);

				setParticles(
					(await (
						await fetch(
							`${import.meta.env.BASE_URL}generated/${selectedVersion}/particles.json`
						)
					).json()) as string[]
				);

				setSoundEvents(
					(await (
						await fetch(
							`${import.meta.env.BASE_URL}generated/${selectedVersion}/sound_events.json`
						)
					).json()) as string[]
				);
			} catch (err: any) {
				console.error(err.message);
			}
		};
		fetchFiles();
	}, [selectedVersion]);

	useEffect(() => {
		if (!selectedVersion && versions) {
			setSelectedVersion(versions.reverse()[0]);
		}
	}, [versions]);

	return (
		<>
			{showSettings && (
				<SettingsBackdrop>
					<SettingsMenuStyle>
						<Title
							style={{
								paddingLeft: 20,
								paddingTop: 20,
								margin: 0,
							}}
						>
							Settings
						</Title>
						<Box
							style={{
								display: "flex",
								flexDirection: "column",
								flexGrow: 1,
								gap: 50,
								padding: 20,
							}}
						>
							<FormInput
								type="text"
								label="Datapack name"
								name="datapackName"
								required={true}
								value={datapackName}
								onChange={(event) => {
									setDatapackName(event.target.value);
								}}
							/>
							<FormInput
								type="text"
								label="Datapack id"
								name="datapackId"
								required={true}
								value={datapackId}
								inputProps={{ maxLength: 16 }}
								onChange={(event) => {
									setDatapackId(
										event.target.value.toLowerCase().replace(/ /g, "_")
									);
								}}
							/>

							<SettingsAcceptButton
								disabled={!datapackId || !datapackName}
								onClick={() => setShowSettings(false)}
							>
								<CheckIcon
									sx={{
										color: "white !important",
									}}
									style={{
										transform: "translateX(-20%) translateY(20%)",
										width: 20,
										height: 20,
									}}
								/>
								Accept
							</SettingsAcceptButton>
							{(dragons.length > 0 || armors.length > 0) && (
								<SettingsClearButton
									onClick={() => {
										if (
											window.confirm("Are you sure you wish to clear all data?")
										) {
											setDragons([]);
											setArmors([]);
											setSelectedDragon(null);
											setSelectedArmor(null);
										}
									}}
								>
									<DeleteForeverIcon
										style={{
											transform: "translateX(-20%) translateY(20%)",
											width: 20,
											height: 20,
										}}
									/>
									Clear data
								</SettingsClearButton>
							)}
						</Box>
					</SettingsMenuStyle>
				</SettingsBackdrop>
			)}
			<Box
				style={{
					display: "flex",
					flexGrow: 1,
				}}
			>
				<ObjectListComponent
					setMarkedForSave={setMarkedForSave}
					clearData={() => {
						setDragons([]);
						setArmors([]);
						setSelectedDragon(null);
						setSelectedArmor(null);
					}}
					versions={versions}
					selectedVersion={selectedVersion}
					setSelectedVersion={setSelectedVersion}
					objects={{ dragons, armors }}
					addNewObject={(category) => {
						let obj: BaseObjectProp = {
							id: crypto.randomUUID(),
							name: "",
						};

						if (category === "dragons") {
							setDragons([...dragons, obj]);
						} else if (category === "armors") {
							setArmors([...armors, obj]);
						}

						return obj;
					}}
					removeObject={(category, object) => {
						if (category === "dragons") {
							const isConfirmed = window.confirm(
								"Are you sure you wish to delete this dragon?"
							);
							if (!isConfirmed) return;

							let selectedId = object?.id;
							if (selectedId === selectedDragon) {
								setSelectedDragon(null);
							}

							setDragons(dragons.filter((d) => d.id !== object.id));
						} else if (category === "armors") {
							const isConfirmed = window.confirm(
								"Are you sure you wish to delete this armor?"
							);
							if (!isConfirmed) return;

							let selectedId = object?.id;
							if (selectedId === selectedArmor) {
								setSelectedArmor(null);
							}

							setArmors(armors.filter((a) => a.id !== object.id));
						}
					}}
					selectedObject={selectedDragon ?? selectedArmor}
					setSelectedObject={(category, object) => {
						if (category === "dragons") {
							setSelectedDragon(object.id);
							setSelectedArmor(null);
						} else {
							setSelectedArmor(object.id);
							setSelectedDragon(null);
						}
					}}
					defaultName={(mode) =>
						mode === "dragons" ? "Unnamed Dragon" : "Unnamed Armor"
					}
					title={(mode) => (mode === "dragons" ? "Dragons" : "Armors")}
					openSettings={function (): void {
						setShowSettings(true);
					}}
					saveData={function (): void {
						throw new Error("Function not implemented.");
					}}
				/>

				{selectedDragon && (
					<ObjectInfoComponent<Dragon>
						type="dragon"
						objects={dragons}
						object={dragons.find((d) => d.id === selectedDragon)!}
						setObjects={(dragons) => setDragons(dragons)}
					/>
				)}
				{selectedArmor && (
					<ObjectInfoComponent<Armor>
						type="armor"
						objects={armors}
						object={armors.find((a) => a.id === selectedArmor)!}
						setObjects={(armors) => setArmors(armors)}
					/>
				)}
			</Box>
		</>
	);
};

const SettingsMenuStyle = styled.div`
	display: flex;
	flex-direction: column;
	background: #343741;
	margin: auto;
	border-radius: 15px;
`;

const SettingsBackdrop = styled.div`
	position: absolute;
	display: flex;
	flex: 1 0 auto;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	overflow: hidden;
	backdrop-filter: blur(5px) brightness(50%);
`;

const SettingsAcceptButton = styled(Button)`
	position: relative;
	bottom: 0;
	right: 0;
	width: auto;
	height: auto;
	line-height: 2;
	background: seagreen;
	border-radius: 0;

	&:disabled {
		background: darkslategray;
		cursor: not-allowed;
	}
`;

const SettingsClearButton = styled(Button)`
	position: relative;
	bottom: 0;
	left: 0;
	width: auto;
	height: auto;
	line-height: 2;
	background: indianred;
	border-radius: 0;
`;

export default DMRPage;
