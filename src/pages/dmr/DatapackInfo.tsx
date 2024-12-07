import { Box, MenuItem } from "@mui/material";
import { Mode } from "./DMR.tsx";
import { Container, SelectField, Title } from "../../StyledProps.tsx";
import { FormInput } from "../../Form.tsx";

type DatapackInfoProps = {
	versions: string[];
	selectedVersion: string;
	setSelectedVersion: (version: string) => void;

	dataPackName: string;
	setDatapackName: (name: string) => void;

	datapackId: string;
	setDatapackId: (id: string) => void;

	mode: Mode;
	setMode: (mode: Mode) => void;
};

export function DatapackInfo({
	versions,
	selectedVersion,
	setSelectedVersion,
	dataPackName,
	setDatapackName,
	datapackId,
	setDatapackId,
	mode,
	setMode,
}: DatapackInfoProps) {
	return (
		<div
			style={{
				flex: "0 1 0px",
			}}
		>
			<Container
				key="datapack-info"
				style={{
					flex: "0 1 250px",
				}}
			>
				<Title>Datapack info</Title>
				<Box
					component="form"
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 6,
						width: "100%",
					}}
				>
					<FormInput
						type="text"
						label="Datapack name"
						name="datapackName"
						required={true}
						value={dataPackName}
						onChange={(event) => setDatapackName(event.target.value)}
					/>
					<FormInput
						type="text"
						label="Datapack id"
						name="datapackId"
						required={true}
						value={datapackId}
						onChange={(event) => setDatapackId(event.target.value)}
					/>
					{versions && (
						<>
							<SelectField
								value={selectedVersion ?? versions[0]}
								onChange={(event) =>
									setSelectedVersion(event.target.value as string)
								}
								style={{
									color: "white",
								}}
							>
								{versions.reverse().map((version: string) => (
									<MenuItem value={version}>{version}</MenuItem>
								))}
							</SelectField>
						</>
					)}
				</Box>
			</Container>
			<Container style={{ flex: "1 1 200px" }} key="mode">
				<Title>Mode</Title>
				<Box
					component="form"
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 8,
						width: "100%",
					}}
				>
					<SelectField
						value={mode}
						onChange={(event) =>
							setMode(event.target.value as "dragon" | "armor")
						}
						style={{
							color: "white",
						}}
					>
						<MenuItem value="dragon">Dragons</MenuItem>
						{/* <MenuItem value="armor">Armors</MenuItem> */}
					</SelectField>
				</Box>
			</Container>
		</div>
	);
}
