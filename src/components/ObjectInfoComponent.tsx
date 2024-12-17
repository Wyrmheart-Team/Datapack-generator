import styled from "styled-components";
import { Armor, BaseObjectProp, Dragon } from "../types/DMRTypes";
import { Box, Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DataArrayIcon from "@mui/icons-material/DataArray";
import InfoIcon from "@mui/icons-material/Info";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { FormInput } from "../app/Form.tsx";
import { ImageInputField, StyledFormInput } from "../app/StyledProps.tsx";
type ObjectInfoComponentProps =
	| {
			object: Dragon;
			objects: Dragon[];
			setObjects: (objects: Dragon[]) => void;
			type: "dragon";
	  }
	| {
			object: Armor;
			objects: Armor[];
			setObjects: (objects: Armor[]) => void;
			type: "armor";
	  };
export function ObjectInfoComponent(props: ObjectInfoComponentProps) {
	const { object, type, setObjects, objects } = props;
	const [selectedTab, setSelectedTab] = useState<string>("Info");
	const [Page, setPage] = useState<JSX.Element | null>(null);
	const Tab = ({
		name,
		Icon,
		page,
	}: {
		name: string;
		Icon?: React.FC;
		page: JSX.Element;
	}) => {
		if (!Page && selectedTab === name) {
			setPage(page);
		}
		return (
			<TabBtn
				key={name}
				$isSelected={selectedTab === name}
				onClick={() => {
					setSelectedTab(name);
					setPage(page);
				}}
			>
				{Icon ? (
					<Icon
						// @ts-expect-error Stuff
						style={{
							transform: "translateX(-25%)",
						}}
					/>
				) : null}
				{name}
			</TabBtn>
		);
	};

	return (
		<ObjectSection>
			{type === "dragon" && (
				<>
					<Toolbar>
						<Tab
							name="Info"
							Icon={InfoIcon}
							page={
								<>
									<StyledFormInput
										name="name"
										label="Dragon Name"
										required={true}
										defaultValue={object.name}
										onChange={(e: any) => {
											object.name = e.target.value;
											setObjects(
												objects.map((o) => (o.id === object.id ? object : o))
											);
										}}
									/>
								</>
							}
						/>
						<Tab
							name="Textures"
							Icon={ImageIcon}
							page={
								<>
									<ImageInputField
										label="Body Texture"
										fileTypes=".png"
										tooltip="The main texture file for the dragon."
										value={object.texture}
										required={true}
										onChange={(e: any) => {
											object.texture = e.target.value;
											setObjects(
												objects.map((o) => (o.id === object.id ? object : o))
											);
										}}
									/>

									<ImageInputField
										label="Saddle Texture"
										fileTypes=".png"
										tooltip="The texture file for the dragon's saddle"
										value={object.saddleTexture}
										onChange={(e: any) => {
											object.saddleTexture = e.target.value;
											setObjects(
												objects.map((o) => (o.id === object.id ? object : o))
											);
										}}
									/>

									<ImageInputField
										label="Glow Texture"
										fileTypes=".png"
										tooltip="The texture file for the dragon's glow effect. This is a glow in the dark effect."
										value={object.glowTexture}
										onChange={(e: any) => {
											object.glowTexture = e.target.value;
											setObjects(
												objects.map((o) => (o.id === object.id ? object : o))
											);
										}}
									/>

									<ImageInputField
										label="Egg Texture"
										fileTypes=".png"
										tooltip="The texture file for the dragon's egg block"
										value={object.eggTexture}
										onChange={(e: any) => {
											object.eggTexture = e.target.value;
											setObjects(
												objects.map((o) => (o.id === object.id ? object : o))
											);
										}}
									/>

									<ImageInputField
										label="Egg Texture Mcmeta"
										fileTypes=".mcmeta"
										tooltip="The mcmeta file for the egg. Only required if you want to have a animated texture for the egg."
										value={object.eggTextureMcmeta}
										onChange={(e: any) => {
											object.eggTextureMcmeta = e.target.value;
											setObjects(
												objects.map((o) => (o.id === object.id ? object : o))
											);
										}}
									/>
								</>
							}
						/>
						<Tab name="Models" Icon={InventoryIcon} page={<InfoIcon />} />
						<Tab
							name="Animations"
							Icon={DirectionsRunIcon}
							page={<InfoIcon />}
						/>
						<Tab name="Variants" Icon={PersonAddAltIcon} page={<InfoIcon />} />
						<Tab name="Fields" Icon={DataArrayIcon} page={<InfoIcon />} />
					</Toolbar>
					<DataSection>{Page}</DataSection>
				</>
			)}

			{type === "armor" && (
				<>
					<Toolbar>
						<Tab
							name="Info"
							Icon={InfoIcon}
							page={
								<StyledFormInput
									name="name"
									label="Name"
									value={object.name}
									onChange={(e: any) => {
										console.log(e.target.value);
										object.name = e.target.value;
									}}
								/>
							}
						/>
						<Tab name="Textures" Icon={ImageIcon} page={<InfoIcon />} />
						<Tab name="Fields" Icon={DataArrayIcon} page={<InfoIcon />} />
					</Toolbar>
					<DataSection>{Page}</DataSection>
				</>
			)}
		</ObjectSection>
	);
}

const ObjectSection = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	margin-left: 20px;
`;

const Toolbar = styled.div`
	width: 100%;
	height: 55px;
	display: flex;
	flex-direction: row;
	background: #212127;
`;

const DataSection = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	background: #282c34;
	overflow-y: scroll;
`;

const Btn = styled(Button)`
	color: white !important;
	border-radius: 0 !important;
	transition: all 0.3s;
	font-weight: bold;
	background: none;
	z-index: 1;
	pointer-events: auto;
	text-align: center;
	flex: 1 0 auto;
	height: 100%;

	&:hover {
		background: #646cff !important;
	}
`;

const TabBtn = styled(Btn)<{ $isSelected: boolean }>`
	background: ${(props) => (props.$isSelected ? "#3b49b2" : "none")} !important;
`;
