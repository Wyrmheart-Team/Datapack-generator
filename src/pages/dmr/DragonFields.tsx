import { FieldProp } from "../../App.tsx";
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
import {
	KeyValuePairInput,
	ColorField,
	StrictNumericTextField,
} from "../../StyledProps.tsx";
import { FormInput } from "../../Form.tsx";

export function dragonFields(
	field: FieldProp,
	selectedDragon: Dragon | null,
	dragons: Dragon[],
	setDragons: (dragons: Dragon[]) => void,
	setSelectedDragon: (dragon: Dragon | null) => void,
	items: string[],
	attributes: string[],
	damageTypes: string[],
	lootTables: string[],
	particles: string[],
	soundEvents: string[]
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
	if (field.options || Object.keys(fieldTypes).includes(field.type)) {
		return (
			<Autocomplete
				freeSolo
				options={field.options ?? fieldTypes[field.type]}
				getOptionLabel={(option) => option}
				limitTags={2}
				fullWidth
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
				onChange={(_event: any, value: any) => setFieldValue(value)}
			/>
		);
	}

	if (field.type === "attributes") {
		return (
			<KeyValuePairInput
				onChange={(pairs) => {}}
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
					setFieldValue(value);
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
			value={getFieldValue()}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<HelpButton />
					</InputAdornment>
				),
			}}
		/>
	);
}
