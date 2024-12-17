import { DragonFieldTypes } from "./DMRFieldTypes";

export type BaseObjectProp = {
	id: string;
	name: string;
};

export type Dragon = BaseObjectProp & {
	name?: string;
	id: string;
	texture?: File;
	eggTexture?: File;
	eggTextureMcmeta?: File;
	glowTexture?: File;
	saddleTexture?: File;
	model?: File;
	animation?: File;
	fields?: DragonFieldTypes;
};
export type Armor = BaseObjectProp & {
	name: string;
	id: string;
	texture?: File;
	itemTexture?: File;
	defence?: number;
};
export type Mode = "dragon" | "armor";
