import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import { TextFieldProps } from "@mui/material";
import { InputField } from "./StyledProps.tsx";

// Form Context Interface
interface FormContextType {
	registerField: (name: string) => void;
	unregisterField: (name: string) => void;
	setFieldValue: (name: string, value: string) => void;
	getFieldValue: (name: string) => string;
	validate: () => boolean;
	errors: Record<string, string>;
	hasErrorInSection: (fieldNames: string[]) => boolean;
}
// Create Form Context
const FormContext = createContext<FormContextType | null>(null);

// Form Provider Component
export const FormProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [fields, setFields] = useState<Record<string, string>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const registerField = useCallback((name: string) => {
		setFields((prev) => ({ ...prev, [name]: "" }));
		setErrors((prev) => ({ ...prev, [name]: "" })); // Initialize errors
	}, []);

	const unregisterField = useCallback((name: string) => {
		setFields((prev) => {
			const newFields = { ...prev };
			delete newFields[name];
			return newFields;
		});
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[name];
			return newErrors;
		});
	}, []);

	const setFieldValue = (name: string, value: string) => {
		setFields((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error if valid
	};

	const getFieldValue = (name: string) => {
		return fields[name];
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};
		Object.entries(fields).forEach(([name, value]) => {
			if (!value.trim() || value.trim() === "") {
				newErrors[name] = "This field is required";
			}
		});
		setErrors(newErrors);
		return Object.values(newErrors).every((error) => !error);
	};

	const hasErrorInSection = (fieldNames: string[]) => {
		return fieldNames.some((name) => !!errors[name]);
	};

	return (
		<FormContext.Provider
			value={{
				registerField,
				unregisterField,
				setFieldValue,
				getFieldValue,
				validate,
				errors,
				hasErrorInSection,
			}}
		>
			{children}
		</FormContext.Provider>
	);
};

// Custom Hook
export const useForm = () => {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error("useForm must be used within a FormProvider");
	}
	return context;
};

interface FormInputProps extends Omit<TextFieldProps, "name"> {
	name: string; // Ensure name is required for form registration
	required?: boolean;
	$isDirty?: boolean;
	$setIsDirty?: (isDirty: boolean) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
	name,
	required = false,
	...props
}) => {
	const {
		registerField,
		unregisterField,
		setFieldValue,
		getFieldValue,
		errors,
	} = useForm();

	useEffect(() => {
		if (required) registerField(name); // Register field
		return () => unregisterField(name); // Unregister on cleanup
	}, [name, required, registerField, unregisterField]);

	useEffect(() => {
		if (props.$isDirty && props.$setIsDirty) {
			props.$setIsDirty(false);
			setFieldValue(name, props.value as string);
		}
	}, [props.$isDirty, props.value, name, setFieldValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// setFieldValue(name, e.target.value); // Update the value in the form context
		if (props.onChange) {
			props.onChange(e); // Call any external onChange handler
		}
	};

	useEffect(() => {
		if (props.value && !getFieldValue(name)) {
			setFieldValue(name, props.value as string);
		}
	}, []);

	return (
		<InputField
			{...props}
			name={name}
			onChange={handleChange}
			required={required}
			error={!!errors[name]} // Show error state if field is required and missing
			helperText={errors[name] || props.helperText}
			FormHelperTextProps={
				errors[name]
					? { style: { color: "indianred", fontStyle: "italic" } }
					: {}
			}
		/>
	);
};
