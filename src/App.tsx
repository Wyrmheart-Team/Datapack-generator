import { BrowserRouter, Route, Routes } from "react-router-dom";
import DMRPage from "./pages/dmr/DMR.tsx";
import Navbar from "./NavBar.tsx";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Accordion, InputAdornment, Select, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { MuiColorInput } from "mui-color-input";
import { default as MuiButton } from "@mui/material/Button";

function App() {
	const [versions, setVersions] = useState<VersionsProp>({});
	const [fields, setFields] = useState<FieldsProp>({});
	useEffect(() => {
		fetch("versions.json").then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			response.json().then((versions) => {
				setVersions(versions);
			});
		});

		fetch("fields.json").then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to fetch data: ${response.statusText}`);
			}

			response.json().then((fields) => {
				setFields(fields);
			});
		});
	}, []);

	return (
		<>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route
						path="/dmr"
						element={
							<DMRPage versions={versions["dmr"]} fields={fields["dmr"]} />
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export type Page = {
	versions: string[];
	fields: [
		{
			version: string;
			dragonFields: FieldProp[];
			armorFields: FieldProp[];
		},
	];
};

type FieldsProp = {
	[key: string]: [
		{
			version: string;
			dragonFields: FieldProp[];
			armorFields: FieldProp[];
		},
	];
};

export type FieldProp = {
	name: string;
	description: string;
	type: string;
	multiple?: boolean;
	options?: string[];
};

type VersionsProp = {
	[key: string]: string[];
};

export default App;
export const TransparentAccordion = styled(Accordion)`
    box-shadow: none;

    & :before {
        display: none;
    }

,
`;
export const Title = styled.h1`
	font-size: 24px;
	margin-bottom: 25px;
	margin-top: 0;
	color: white;
`;
export const Button = styled.button`
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 0.5rem;
	padding: 0.5rem;
	font-size: 16px;
	cursor: pointer;
`;
export const InputField = styled(TextField)`
	height: 2rem;
	border: 1px solid #282c34;
	border-radius: 0.5rem;
	padding: 10px;
	font-size: 16px;

	& .MuiInputBase-input {
		color: white;
	}

	& .MuiInputLabel-root {
		color: darkgray;
		font-style: italic;
	}
`;
export const SelectField = styled(Select)`
	height: 3rem;
	border: 1px solid #282c34;
	border-radius: 0.5rem;
	//padding: 20px;
	font-size: 16px;

	& .MuiInputLabel-root {
		color: darkgray;
		font-style: italic;
	}
`;
export const ColorField = styled(MuiColorInput)`
	height: 2rem;
	border: 1px solid #282c34;
	border-radius: 0.5rem;
	padding: 10px;
	font-size: 16px;
	background-color: #282c34;

	& .MuiInputBase-input {
		color: white;
	}

	& .MuiInputLabel-root {
		color: darkgray;
		font-style: italic;
	}
`;
export const Container = styled.div`
	display: flex;
	flex-direction: column;
	background-color: #282c34;
	border-radius: 15px;
	padding: 20px;
	margin: 20px;
	width: 15vw;
`;

export function FileInputWithTextField({
	label,
	required,
	onChange,
}: {
	label: string;
	required?: boolean;
	onChange: (arg: File) => void;
}) {
	const [fileName, setFileName] = useState("");

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			setFileName(file.name);
			onChange(file);
		}
	};

	const handleBrowseClick = (
		// @ts-expect-error It cant make up its mind on the typing
		event: MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		document.getElementById("file-upload")!.click();
	};

	return (
		<>
			<input
				id="file-upload"
				type="file"
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>

			<InputField
				value={fileName}
				label={label}
				placeholder="No file selected"
				required={required}
				InputProps={{
					readOnly: true,
					disabled: true,
					endAdornment: (
						<InputAdornment position="end">
							<MuiButton
								variant="contained"
								type="button"
								startIcon={<CloudUploadIcon />}
								onClick={handleBrowseClick}
							>
								Upload file
							</MuiButton>
						</InputAdornment>
					),
				}}
			/>
		</>
	);
}
