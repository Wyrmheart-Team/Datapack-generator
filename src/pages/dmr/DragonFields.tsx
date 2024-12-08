import { FieldProp } from "../../App.tsx";
import { JSX, useState } from "react";
import {
	Autocomplete,
	IconButton,
	InputAdornment,
	Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { matchIsValidColor } from "mui-color-input";
import {
	KeyValuePairInput,
	ColorField,
	StrictNumericTextField,
} from "../../StyledProps.tsx";
import { FormInput } from "../../Form.tsx";
import { Dragon, DragonFieldTypes } from "../../Types.ts";

type DragonFieldsProps = {
	field: FieldProp;
	selectedDragon: Dragon | null;
	dragons: Dragon[];
	setDragons: (dragons: Dragon[]) => void;
	setSelectedDragon: (dragon: Dragon | null) => void;
	items: string[];
	attributes: string[];
	damageTypes: string[];
	lootTables: string[];
	particles: string[];
	soundEvents: string[];
};

export const DragonFields = ({
	field,
	selectedDragon,
	dragons,
	setDragons,
	setSelectedDragon,
	items,
	attributes,
	damageTypes,
	lootTables,
	particles,
	soundEvents,
}: DragonFieldsProps): JSX.Element => {
	const [displayValue, setDisplayValue] = useState<string | undefined>(
		undefined
	);

	const setFieldValue = (value: any) => {
		if (!selectedDragon) return;
		let dragon = dragons.find((d) => d.id === selectedDragon.id)!;

		console.log("Setting field value", field.name, value, typeof value);

		dragon.fields = {
			...dragon.fields,
			[field.name]: value,
		} as DragonFieldTypes;

		setDragons(dragons.map((d) => (d.id === selectedDragon.id ? dragon : d)));
		setSelectedDragon(dragon);
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
		const hexToInt = (hex?: string) => {
			if (!hex) return undefined;

			const sanitizedHex = hex.replace("#", "");
			return parseInt(sanitizedHex, 16);
		};

		return (
			<ColorField
				value={displayValue ?? "#ffffff"}
				format="hex"
				isAlphaHidden={true}
				onChange={(color) => {
					if (matchIsValidColor(color)) {
						setFieldValue(hexToInt(color)!);
						setDisplayValue(color);
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
				slotProps={{
					input: {
						endAdornment: (
							<>
								<InputAdornment position="end">
									<HelpButton />
								</InputAdornment>
							</>
						),
					},
				}}
				label={field.name}
			/>
		);
	}

	//TODO Swap to a more custom solution of adding elements with properties, so that loot tables can be added with chance and other properties
	// Maybe even just something like similar appearance to jsoneditoronline.org tree view
	const fieldTypes: { [key: string]: string[] } = {
		items,
		damage_types: damageTypes,
		loot_tables: lootTables,
		particles,
		sound_events: soundEvents,
	};

	if (
		field.options ||
		(Object.keys(fieldTypes).includes(field.type) && field.multiple)
	) {
		return (
			<Autocomplete
				freeSolo
				options={field.options ?? fieldTypes[field.type]}
				getOptionLabel={(option) => option}
				autoHighlight
				disableClearable
				filterSelectedOptions
				multiple={field.multiple}
				renderInput={(params) => (
					<FormInput
						autoComplete="off"
						{...params}
						label={field.name}
						name={field.name}
						onChange={(event: any) => {
							const value = event.target.value.trim();

							setFieldValue(value.split(",").filter((s: any) => s.trim()));
							setDisplayValue(value);
						}}
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
					setFieldValue(value);
					setDisplayValue(value);
				}}
			/>
		);
	}

	if (field.type === "abilities") {
		return (
			<Autocomplete
				freeSolo
				options={field.options ?? []}
				getOptionLabel={(option: any) => option.type ?? option}
				autoHighlight
				disableClearable
				filterSelectedOptions
				multiple={field.multiple && field.options}
				renderInput={(params) => (
					<FormInput
						autoComplete="off"
						{...params}
						label={field.name}
						name={field.name}
						onChange={(event: any) => {
							const value = event.target.value.trim();
							setFieldValue(
								value
									.split(",")
									.filter((s: any) => s.trim())
									.map((ability: any) => {
										return { type: ability };
									})
							);
							setDisplayValue(value);
						}}
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
			/>
		);
	}

	if (field.type === "habitats") {
		return (
			<Autocomplete
				freeSolo
				options={field.options ?? []}
				getOptionLabel={(option: any) => option.type ?? option}
				autoHighlight
				disableClearable
				filterSelectedOptions
				multiple={field.multiple && field.options}
				renderInput={(params) => (
					<FormInput
						autoComplete="off"
						{...params}
						label={field.name}
						name={field.name}
						onChange={(event: any) => {
							const value = event.target.value.trim();

							setFieldValue(
								value
									.split(",")
									.filter((s: any) => s.trim())
									.map((habitat: any) => {
										return { type: habitat };
									})
							);
							setDisplayValue(value);
						}}
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
			/>
		);
	}

	if (field.type === "attributes") {
		return (
			<KeyValuePairInput
				onChange={(pairs) => {
					const values = pairs.reduce((acc: any, pair: any) => {
						acc[pair.key] = parseFloat(pair.value);
						return acc;
					}, {});
					setFieldValue(values);
					setDisplayValue(
						pairs.map((pair) => `${pair.key}=${pair.value}`).join(", ")
					);
				}}
				label={field.name}
				options={attributes}
				InputProps={{
					// @ts-expect-error Stuff
					endAdornment: (
						<>
							<InputAdornment position="end">
								<HelpButton />
							</InputAdornment>
						</>
					),
				}}
			/>
		);
	}

	if (field.type === "int" || field.type === "float") {
		return (
			<StrictNumericTextField
				label={field.name}
				onChange={(value) => {
					setFieldValue(
						field.type === "int" ? parseInt(value) : parseFloat(value)
					);
					setDisplayValue(value);
				}}
				InputProps={{
					endAdornment: (
						<>
							<InputAdornment position="end">
								<HelpButton />
							</InputAdornment>
						</>
					),
				}}
			/>
		);
	}

	return (
		<FormInput
			type={"text"}
			label={field.name}
			name={field.name}
			key={field.name}
			onChange={(event) => {
				const value = event.target.value;
				setFieldValue(field.multiple ? value.split(",") : value);
				setDisplayValue(value);
			}}
			value={displayValue}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<HelpButton />
					</InputAdornment>
				),
			}}
		/>
	);
};
