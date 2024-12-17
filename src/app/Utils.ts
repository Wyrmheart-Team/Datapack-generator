// Utilities for serialization and deserialization
export const serializeWithFile = async (data: any): Promise<any> => {
	const serialize = async (value: any): Promise<any> => {
		if (value instanceof File) {
			const base64 = await fileToBase64(value);
			return {
				__isFile: true,
				id: crypto.randomUUID(),
				name: value.name,
				type: value.type,
				content: base64,
			};
		}

		if (Array.isArray(value)) {
			return await Promise.all(value.map(serialize));
		}

		if (value && typeof value === "object") {
			const entries = await Promise.all(
				Object.entries(value).map(async ([key, val]) => [
					key,
					await serialize(val),
				])
			);
			return Object.fromEntries(entries);
		}

		return value;
	};

	return JSON.stringify(await serialize(data));
};

export const deserializeWithFile = (serialized: string): any => {
	const deserialize = (value: any): any => {
		if (value && value.__isFile) {
			const byteString = atob(value.content.split(",")[1]);
			const arrayBuffer = new ArrayBuffer(byteString.length);
			const uintArray = new Uint8Array(arrayBuffer);
			for (let i = 0; i < byteString.length; i++) {
				uintArray[i] = byteString.charCodeAt(i);
			}
			const blob = new Blob([arrayBuffer], { type: value.type });
			return new File([blob], value.name, { type: value.type });
		}

		if (Array.isArray(value)) {
			return value.map(deserialize);
		}

		if (value && typeof value === "object") {
			const entries = Object.entries(value).map(([key, val]) => [
				key,
				deserialize(val),
			]);
			return Object.fromEntries(entries);
		}

		return value;
	};

	return deserialize(JSON.parse(serialized));
};

const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(file);
	});
};

// Load initial state
export const loadInitialState = <T>(key: string, defaultValue: T): T => {
	const serialized = localStorage.getItem(key);
	return serialized ? deserializeWithFile(serialized) : defaultValue;
};

// Save to localStorage whenever state changes
export const saveToLocalStorage = async (key: string, data: any) => {
	const serializedData = await serializeWithFile(data);
	localStorage.setItem(key, serializedData);
};
