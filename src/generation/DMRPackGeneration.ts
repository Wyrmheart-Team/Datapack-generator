import { Dragon } from "../types/DMRTypes";
import JSZip from "jszip";
import { DragonFieldTypes } from "../types/DMRFieldTypes";

export function saveDatapack(
	markedForSave: string,
	dragons: Dragon[],
	datapackId: string,
	datapackName: string
): void {
	if (markedForSave === "zip") {
		generateZip(dragons, datapackId, datapackName);
	} else if (markedForSave === "mod") {
		generateMod(dragons, datapackId, datapackName);
	}
}

function generateMod(
	dragons: Dragon[],
	datapackId: string,
	datapackName: string
): void {
	// Patch the static final value in the .class file
	function patchStaticFinal(
		buffer: Uint8Array,
		oldString: string,
		newString: string,
		paddingChar: string = "x"
	): { array: Uint8Array; text: string } {
		const oldBytes = new TextEncoder().encode(oldString);
		const newBytes = new TextEncoder().encode(newString);

		if (newBytes.length > oldBytes.length) {
			throw new Error(
				"There was an error patching the .class file. The new string is longer than the old string."
			);
		}

		let found = false;

		// Find and replace the old string
		for (let i = 0; i < buffer.length - oldBytes.length; i++) {
			const segment = buffer.subarray(i, i + oldBytes.length);
			if (segment.every((b, j) => b === oldBytes[j])) {
				// Replace the string and null-pad the remaining space
				for (let j = 0; j < oldBytes.length; j++) {
					buffer[i + j] =
						j < newBytes.length ? newBytes[j] : paddingChar.charCodeAt(0);
				}
				found = true;
				break;
			}
		}

		if (!found) {
			throw new Error(
				"There was an error patching the .class file. The old string was not found."
			);
		}

		const paddedValue =
			new TextDecoder().decode(newBytes) +
			"\u0000".repeat(oldBytes.length - newBytes.length);

		return { array: buffer, text: paddedValue };
	}
	// Handle modification and packing the .class into a .jar
	const handleModifyAndPack = async () => {
		const oldString = "placeholdertextx"; // The placeholder in the .class file

		try {
			// Fetch the .class file from the public folder
			const response = await fetch(
				`generated/1.21.1/mod/classes/DMRDatapack.class`
			);
			if (!response.ok) {
				throw new Error(`There was an error fetching the .class file.`);
			}
			const classBuffer = new Uint8Array(await response.arrayBuffer());

			// Patch the .class file
			const { array, text } = patchStaticFinal(
				classBuffer,
				oldString,
				datapackId
			);

			const modsToml = await fetch(
				`generated/1.21.1/mod/resources/META-INF/neoforge.mods.toml`
			);
			if (!modsToml.ok) {
				throw new Error(`There was an error fetching the mods.toml file.`);
			}

			const tomlContent = await modsToml.text();

			const updatedTomlContent = tomlContent.replace(
				new RegExp(oldString, "g"),
				text
			);

			// Create a new .jar file containing the modified .class
			const zip = new JSZip();
			zip.file(`dmr_datapack/DMRDatapack.class`, array);
			zip.file(`META-INF/neoforge.mods.toml`, updatedTomlContent);

			generateZips(dragons, datapackId, datapackName, "mod", zip, zip);

			zip.file(
				`pack.mcmeta`,
				JSON.stringify(
					{
						pack: {
							pack_format: 9,
							description: `Resources for ${datapackName}`,
						},
					},
					null,
					2
				)
			);

			const modifiedJar = await zip.generateAsync({ type: "blob" });

			// Create a download link
			const url = URL.createObjectURL(modifiedJar);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${datapackName}.jar`;
			link.click();

			// Clean up
			URL.revokeObjectURL(url);
		} catch (error: any) {
			console.error(`There was an error: ${error.message}`);
			alert(error.message);
		}
	};

	handleModifyAndPack();
}

function generateZips(
	dragons: Dragon[],
	datapackId: string,
	datapackName: string,
	type: string,
	resourceZip: JSZip,
	dataZip: JSZip
): void {
	const lang: { [key: string]: string } = {};

	// Add dragons to zip
	dragons.forEach((dragon) => {
		const dragonId = dragon.name!.toLowerCase().replace(/ /g, "_");
		const name = dragon.name!;

		if (dragon.model) {
			resourceZip.file(`assets/dmr/geo/${dragonId}.json`, dragon.model);
		}

		if (dragon.animation) {
			resourceZip.file(
				`assets/dmr/animations/${dragonId}.animation.json`,
				dragon.animation
			);
		}

		resourceZip.file(
			`assets/dmr/textures/entity/dragon/${dragonId}/body.png`,
			dragon.texture
		);

		if (dragon.saddleTexture) {
			resourceZip.file(
				`assets/dmr/textures/entity/dragon/${dragonId}/saddle.png`,
				dragon.saddleTexture
			);
		}

		if (dragon.glowTexture) {
			resourceZip.file(
				`assets/dmr/textures/entity/dragon/${dragonId}/glow.png`,
				dragon.glowTexture
			);
		}

		resourceZip.file(
			`assets/dmr/textures/block/${dragonId}_dragon_egg.png`,
			dragon.eggTexture
		);

		resourceZip.file(
			`assets/dmr/models/block/dragon_eggs/${dragonId}_dragon_egg.json`,
			JSON.stringify(
				{
					parent: "minecraft:block/dragon_egg",
					textures: {
						particle: `dmr:block/${dragonId}_dragon_egg`,
						all: `dmr:block/${dragonId}_dragon_egg`,
					},
				},
				null,
				2
			)
		);

		if (dragon.eggTextureMcmeta) {
			resourceZip.file(
				`assets/dmr/textures/block/${dragonId}_dragon_egg.png.mcmeta`,
				dragon.eggTextureMcmeta
			);
		}

		lang[`dmr.dragon_breed.${dragonId}`] = `${name} Dragon`;
		lang[`item.dmr.dragon_spawn_egg.${dragonId}`] = `${name} Dragon Spawn Egg`;
		lang[`block.dmr.dragon_egg.${dragonId}`] = `${name} Dragon Egg`;

		const get = <T>(
			accessor: (fields: DragonFieldTypes) => T | undefined
		): T | undefined => {
			return dragon.fields ? accessor(dragon.fields) : undefined;
		};

		const getAndDo = <T>(
			accessor: (fields: DragonFieldTypes) => T | undefined,
			perform: (value: T) => T
		): T | undefined => {
			const value = get(accessor);
			return value ? perform(value) : undefined;
		};

		const data: Partial<
			Record<
				keyof DragonFieldTypes | "model_location" | "animation_location",
				any
			>
		> = {
			...dragon.fields,
			model_location: dragon.model ? `dmr:geo/${dragonId}.json` : undefined,
			animation_location: dragon.animation
				? `dmr:animations/${dragonId}.animation.json`
				: undefined,
			abilities: get((d) => d.abilities),
			loot_tables: getAndDo(
				(d) => d.loot_tables,
				(d) =>
					d.map((item: string) => {
						return { table: item, min: 1, max: 1, chance: 0.1 };
					})
			),
		};

		console.log(data);

		dataZip.file(
			`data/${datapackId}/dmr/breeds/${dragonId}.json`,
			JSON.stringify(data, null, 2)
		);
	});

	resourceZip.file(
		`assets/${datapackId}/lang/en_us.json`,
		JSON.stringify(lang, null, 2)
	);

	if (type === "zip") {
		resourceZip.file(
			`pack.mcmeta`,
			JSON.stringify(
				{
					pack: {
						pack_format: 22,
						description: `Textures for ${datapackName}`,
					},
				},
				null,
				2
			)
		);

		dataZip.file(
			`pack.mcmeta`,
			JSON.stringify(
				{
					pack: {
						pack_format: 15,
						description: `Data for ${datapackName}`,
					},
				},
				null,
				2
			)
		);
	}
}

function generateZip(
	dragons: Dragon[],
	datapackId: string,
	datapackName: string
): void {
	const zip = new JSZip();
	const resourceZip = new JSZip();
	const dataZip = new JSZip();

	generateZips(dragons, datapackId, datapackName, "zip", resourceZip, dataZip);

	const generatePack = async () => {
		zip.file(
			`${datapackId} - Resource Pack.zip`,
			await resourceZip.generateAsync({ type: "blob" })
		);
		zip.file(
			`${datapackId} - Data Pack.zip`,
			await dataZip.generateAsync({ type: "blob" })
		);

		const zipBlob = await zip.generateAsync({ type: "blob" });

		// Trigger download
		const url = URL.createObjectURL(zipBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${datapackName} - Bundled.zip`;
		link.click();

		// Clean up
		URL.revokeObjectURL(url);
	};

	generatePack();
}
