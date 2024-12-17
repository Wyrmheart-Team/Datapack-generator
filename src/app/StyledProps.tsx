import styled from "styled-components";
import {
	Autocomplete,
	Box,
	Chip,
	IconButton,
	InputAdornment,
	Select,
	TextField,
	TextFieldProps,
	Tooltip,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { default as MuiButton } from "@mui/material/Button";
import { FormInput } from "./Form.tsx";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

// Dark indented box
export const IndentedBox = `
	background-color: #282c34;
	border: 1px solid #1f2229;
	box-shadow:
		inset 2px 2px 5px rgba(0, 0, 0, 0.6),
		inset -2px -2px 5px rgba(55, 61, 73, 0.8);
	border-radius: 5px;
`;

// Lighter complementary box
export const RaisedBox = `
	background-color: #3a3f4b;
	border: 1px solid #4a505e;
	box-shadow:
		2px 2px 5px rgba(0, 0, 0, 0.4),
		-2px -2px 5px rgba(255, 255, 255, 0.1);
	border-radius: 5px;
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

const InputFieldStyled = styled(TextField)`
	height: 2rem;
	border: 1px solid #282c34;
	border-radius: 0.5rem;
	padding-bottom: 20px !important;
	padding-top: 20px !important;
	font-size: 16px;

	& .MuiInputBase-root {
		${RaisedBox};
	}

	& .MuiInputBase-input {
		color: white;
	}

	& .MuiInputLabel-root[data-shrink="true"] {
		padding-top: 30px !important;
	}

	& .MuiInputLabel-root {
		color: white;
		font-style: italic;
	}
`;
export const SelectField = styled(Select)`
	height: 3rem;
	border: 1px solid #282c34;
	border-radius: 0.5rem;
	font-size: 16px;
	${RaisedBox};

	& .MuiSelect-select {
		color: white;
	}
`;
export const ColorField = styled(MuiColorInput)`
	height: 2rem;
	border: 1px solid #282c34;
	border-radius: 0.5rem;
	padding: 10px;
	font-size: 16px;

	& .MuiInputBase-root {
		${RaisedBox};
	}

	& .MuiInputBase-input {
		color: white;
	}

	& .MuiInputLabel-root[data-shrink="true"] {
		padding-top: 25px;
	}

	& .MuiInputLabel-root {
		color: darkgray;
		font-style: italic;
	}
`;

export const SaveSection = styled.div`
	display: flex;
	flex-direction: row;
	gap: 6px;
	right: 10px;
	position: absolute;
	z-index: 10;
	transform: translateY(-120%);
`;

export const SaveButton = styled(IconButton)`
	background-color: #007bff !important;
	color: white !important;
	border: none;
	border-radius: 15px !important;
	padding: 0.5rem;
	font-size: 16px;
	cursor: pointer;
	width: 200px;
`;

export const Container = styled(Box)`
	display: flex;
	flex-direction: column;
	background-color: #282c34;
	border-radius: 15px;
	padding: 20px;
	margin: 20px;
`;

type InputFieldProps = TextFieldProps & {
	name: string;
};

export const InputField: React.FC<InputFieldProps> = ({
	name,
	...textFieldProps
}) => {
	return <InputFieldStyled {...textFieldProps} name={name} />;
};

export const StyledFormInput = styled(FormInput)`
	& .MuiInputBase-root {
		margin: 40px !important;
		//padding: 20px !important;
	}

	& .MuiTextField-root {
		margin: 40px !important;
		padding-top: 20px !important;
	}

	& .MuiInputLabel-root {
		margin: 40px !important;
		padding-top: 20px !important;
	}
`;

export function ImageInputField({
	label,
	tooltip,
	required,
	onChange,
	fileTypes,
	value,
}: {
	label: string;
	tooltip?: string;
	required?: boolean;
	onChange: (arg: File) => void;
	fileTypes?: string;
	value: File | undefined;
}) {
	const [fileName, setFileName] = useState("");
	const [isDirty, setIsDirty] = useState(false);

	const id = `file-upload-${crypto.randomUUID()}`;

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			setFileName(file.name);
			onChange(file);
			setIsDirty(true);
		}
	};

	const handleBrowseClick = (
		// @ts-expect-error It cant make up its mind on the typing
		event: MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		document.getElementById(id)!.click();
	};

	useEffect(() => {
		if (value) {
			setFileName(value.name);
			onChange(value);
			setIsDirty(true);
		}
	}, []);

	return (
		<>
			<input
				id={id}
				type="file"
				accept={fileTypes}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>

			<StyledFormInput
				$isDirty={isDirty}
				$setIsDirty={setIsDirty}
				value={fileName}
				name={label}
				label={label}
				placeholder="No file selected"
				required={required}
				InputProps={{
					style: { pointerEvents: "none" }, // Disable interactions
					readOnly: true,
					endAdornment: (
						<InputAdornment position="end" style={{ pointerEvents: "auto" }}>
							<MuiButton
								style={{ zIndex: 10 }}
								variant="contained"
								type="button"
								startIcon={<CloudUploadIcon />}
								onClick={handleBrowseClick}
							>
								Upload file
							</MuiButton>
							{tooltip && (
								<Tooltip title={tooltip} arrow>
									<IconButton style={{ zIndex: 5 }}>
										<HelpOutlineIcon style={{ color: "white" }} />
									</IconButton>
								</Tooltip>
							)}
						</InputAdornment>
					),
				}}
			/>
		</>
	);
}

const ImageInputFieldStyled = styled(StyledFormInput)``;

interface KeyValuePair {
	key: string;
	value: string;
}

export const KeyValuePairInput: React.FC<{
	onChange: (pairs: KeyValuePair[]) => void;
	label?: string;
	options?: string[];
	InputProps?: { endAdornment: React.FC };
}> = ({ onChange, label, options, InputProps }) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [pairs, setPairs] = useState<KeyValuePair[]>([]);
	const [error, setError] = useState<string>("");

	const handleAddPair = (newValue: string) => {
		const parts = newValue.split("=");
		if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
			const pair = { key: parts[0].trim(), value: parts[1].trim() };
			setPairs((prev) => {
				const updated = [...prev, pair];
				onChange(updated);
				return updated;
			});
			setInputValue("");
			setError(""); // Clear error on successful addition
		} else {
			setError("Invalid format. Use key=value.");
		}
	};

	const isValidPair = (value: string) => {
		const parts = value.split("=");
		return parts.length === 2 && parts[0].trim() && parts[1].trim();
	};

	const handleDeletePair = (pairToDelete: KeyValuePair) => {
		setPairs((prev) => {
			const updated = prev.filter((pair) => pair.key !== pairToDelete.key);
			onChange(updated);
			return updated;
		});
	};

	return (
		<Box>
			<Autocomplete
				multiple
				freeSolo
				options={options ?? []}
				value={pairs.map((pair) => `${pair.key}=${pair.value}`)}
				limitTags={3}
				onChange={(event, newValues, reason) => {
					if (reason === "selectOption") {
						// Appending "=" only when an option is explicitly selected
						const selectedOption = newValues[newValues.length - 1];
						if (selectedOption && !isValidPair(selectedOption)) {
							setInputValue(`${selectedOption}=`);
						}
					} else {
						const validPairs = newValues.filter((value) => isValidPair(value));
						const parsedPairs = validPairs.map((value) => {
							const [key, valuePart] = value.split("=");
							return { key: key.trim(), value: valuePart.trim() };
						});
						setPairs(parsedPairs);
						onChange(parsedPairs);
					}
				}}
				inputValue={inputValue}
				onInputChange={(e, value, reason) => {
					if (reason === "input") {
						setInputValue(value);
						setError(""); // Clear error on new input
					}
				}}
				filterOptions={(options, params) => {
					const value = pairs.map((pair) => pair.key);
					const filtered = options.filter((option) => {
						return value.indexOf(option) === -1;
					});

					if (params.inputValue !== "") {
						filtered.push(params.inputValue);
					}

					return filtered;
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" && isValidPair(inputValue)) {
						handleAddPair(inputValue);
						e.preventDefault();
					} else if (e.key === "Enter" && !isValidPair(inputValue)) {
						setError("Invalid format. Use key=value.");
					}
				}}
				renderTags={(value, getTagProps) =>
					value.map((option, index) => (
						<Chip
							label={option}
							className={getTagProps({ index }).className}
							key={getTagProps({ index }).key}
							disabled={getTagProps({ index }).disabled}
							onDelete={() => handleDeletePair(pairs[index])}
						/>
					))
				}
				renderInput={(params) => (
					<FormInput
						{...params}
						label={label}
						name={label ?? "key-value"}
						variant="outlined"
						error={!!error}
						helperText={error}
						FormHelperTextProps={{
							style: { color: "indianred", fontStyle: "italic" },
						}}
						// @ts-ignore
						InputProps={{
							...params.InputProps,
							...InputProps,
						}}
					/>
				)}
				onBlur={() => {
					if (inputValue && !isValidPair(inputValue)) {
						setError("Invalid format. Use key=value.");
					}
				}}
			/>
		</Box>
	);
};

interface StrictNumericTextFieldProps {
	onChange: (value: string) => void;
	label?: string;
	InputProps?: any;
}

export const StrictNumericTextField: React.FC<StrictNumericTextFieldProps> = ({
	onChange,
	label,
	InputProps,
}) => {
	const [value, setValue] = useState<string>("");
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const allowedKeys = [
			"Backspace",
			"Tab",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
			".", // Allow decimal point
		];

		// Allow numbers (0-9) and the allowed keys
		if (!allowedKeys.includes(e.key) && !(e.key >= "0" && e.key <= "9")) {
			e.preventDefault();
		}

		// Prevent multiple decimal points
		if (e.key === "." && value.includes(".")) {
			e.preventDefault();
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;

		// Allow only numbers and a single decimal point
		if (/^\d*\.?\d*$/.test(inputValue)) {
			onChange(inputValue);
			setValue(inputValue);
		}
	};

	return (
		<FormInput
			type="number"
			name={label!}
			label={label}
			variant="outlined"
			value={value}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			slotProps={{
				input: {
					...InputProps,
					inputMode: "decimal", // For numeric keyboard on mobile
				},
			}}
		/>
	);
};
