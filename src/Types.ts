export type DragonFieldTypes = {
	ambient_sound: string;
	death_loot: string;
	hatch_time: number;
	growth_time: number;
	size_modifier: number;
	primary_color: string;
	secondary_color: string;
	immunities: string[];
	attributes: { [key: string]: number };
	habitats: { type: string; [key: string]: any }[];
	abilities: { type: string }[];
	taming_items: string[];
	breeding_items: string[];
	hatch_particles: string;
	loot_tables: any[];
	accessories: string[];
};

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
