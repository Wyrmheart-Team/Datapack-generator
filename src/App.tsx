import { BrowserRouter, Route, Routes } from "react-router-dom";
import DMRPage from "./pages/dmr/DMR.tsx";
import Navbar from "./NavBar.tsx";
import { useEffect, useState } from "react";

function App() {
	const [versions, setVersions] = useState<VersionsProp>({});
	const [fields, setFields] = useState<FieldsProp>({});
	const [markedForSave, setMarkedForSave] = useState("");

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
				<Navbar onSave={(arg: string) => setMarkedForSave(arg)} />
				<Routes>
					<Route
						path="/"
						element={
							<DMRPage
								versions={versions["dmr"]}
								fields={fields["dmr"]}
								markedForSave={markedForSave}
								setMarkedForSave={setMarkedForSave}
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export type Page = {
	markedForSave: string;
	setMarkedForSave: (arg: string) => void;
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
