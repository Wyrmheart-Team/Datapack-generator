import { DragonFieldTypes } from "./DMRFieldTypes";

export type Dragon = {
	name?: string;
	id: string;
	texture?: File;
	glowTexture?: File;
	saddleTexture?: File;
	model?: File;
	animation?: File;
	fields?: DragonFieldTypes;
};
export type Armor = {
	name: string;
};
export type Mode = "dragon" | "armor";
