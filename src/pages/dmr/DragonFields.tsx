import { ColorField, FieldProp, InputField } from "../../App.tsx";
import { JSX } from "react";
import {
	Autocomplete,
	IconButton,
	InputAdornment,
	Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { matchIsValidColor } from "mui-color-input";
import { Dragon } from "./DMR.tsx";

export function dragonFields(
	field: FieldProp,
	selectedDragon: Dragon | null,
	dragons: Dragon[],
	setDragons: (dragons: Dragon[]) => void,
	setSelectedDragon: (dragon: Dragon | null) => void,
	items: string[]
): JSX.Element {
	const setFieldValue = (value: string) => {
		if (!selectedDragon) return;

		let dragon = dragons.find((d) => d.id === selectedDragon.id)!;
		dragon.fields = {
			...dragon.fields,
			[field.name]: value,
		};

		setDragons(dragons.map((d) => (d.id === selectedDragon.id ? dragon : d)));
		setSelectedDragon(dragon);
	};

	const getFieldValue = () => {
		if (!selectedDragon) return undefined;

		return selectedDragon.fields?.[field.name] ?? undefined;
	};

	const HelpButton = () => {
		return (
			<Tooltip title={field.description} arrow>
				<IconButton>
					<HelpOutlineIcon style={{ color: "white" }} />
				</IconButton>
			</Tooltip>
		);
	};

	if (field.type === "color") {
		return (
			<ColorField
				value={getFieldValue() ?? "#ffffff"}
				format="hex"
				isAlphaHidden={true}
				onChange={(color) => {
					if (matchIsValidColor(color)) {
						setFieldValue(color);
					}
				}}
				PopoverProps={{
					anchorOrigin: {
						vertical: "bottom",
						horizontal: "left",
					},
					transformOrigin: {
						vertical: "top",
						horizontal: "left",
					},
				}}
				label={field.name}
			/>
		);
	}

	if (field.options || field.type === "items") {
		return (
			<Autocomplete
				freeSolo
				options={field.type === "items" ? items : []}
				getOptionLabel={(option) => option}
				limitTags={2}
				fullWidth
				autoHighlight
				disableClearable
				filterSelectedOptions
				multiple={field.multiple}
				sx={{
					"& .MuiAutocomplete-tag": {
						color: "white",
					},
				}}
				renderInput={(params) => (
					<InputField
						autoComplete="off"
						{...params}
						label={field.name}
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{params.InputProps.endAdornment}
									<InputAdornment position="end">
										<HelpButton />
									</InputAdornment>
								</>
							),
						}}
					/>
				)}
				onChange={(_event: any, value: any) => {
					console.log(value);
					setFieldValue(value);
				}}
			/>
		);
	}

	// if (field.type === "int" || field.type === "float") {
	// 	return (
	// 		<NumberInput
	// 			placeholder={field.name}
	// 			value={getFieldValue()}
	// 			onChange={(value) => {
	// 				setFieldValue(value);
	// 			}}
	// 		/>
	// 	);
	// }

	return (
		<InputField
			type={field.type === "float" || field.type === "int" ? "number" : "text"}
			label={field.name}
			key={field.name}
			value={getFieldValue()}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<HelpButton />
					</InputAdornment>
				),
			}}
			onChange={(event) => {
				event.preventDefault();
				let input = event.target.value;
				setFieldValue(input);
			}}
		/>
	);
}