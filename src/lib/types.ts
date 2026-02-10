// Gift types that commanders prefer
export type GiftType = 'Book' | 'Dessert' | 'Drink' | 'Food' | 'Jewelry' | 'Weapon';

export const GIFT_TYPES: GiftType[] = ['Book', 'Dessert', 'Drink', 'Food', 'Jewelry', 'Weapon'];

// Base commander data (static info)
export interface Commander {
	id: string;
	name: string;
	preferredGift: GiftType;
	aptitude: number;
	finance: number;
	command: number;
	combat: number;
	leadership: number;
	awakable: boolean;
}

// Player's progress on a commander
export interface PlayerCommander {
	id: string;
	currentLevel: number;
	maxLevel: number;
	currentExp?: number;
	awakeningLevel: number;
}

// Calculation weights for priority calculation
export interface CalculationWeights {
	aptitude: number;
	finance: number;
	command: number;
	combat: number;
	leadership: number;
}

// Combined commander data with player progress and calculated values
export interface MergedCommander extends Commander {
	playerCommander: PlayerCommander;
	cost: number;
	needsUnlock: boolean;
	needsUpgrade: boolean;
	needsAwakeningUpgrade: boolean;
}

// Profile settings
export interface ProfileSettings {
	hideUnlocked: boolean;
	suggestUpgrades: boolean;
	suggestUnlocks: boolean;
}

// Commander quality levels
export interface CommanderQuality {
	title: string;
	maxLevel: number;
	color: string;
}

export const COMMANDER_QUALITIES: CommanderQuality[] = [
	{ title: 'None', maxLevel: 0, color: 'text-[var(--quality-none)]' },
	{ title: 'Common', maxLevel: 10, color: 'text-[var(--quality-common)]' },
	{ title: 'Uncommon', maxLevel: 20, color: 'text-[var(--quality-uncommon)]' },
	{ title: 'Rare', maxLevel: 30, color: 'text-[var(--quality-rare)]' },
	{ title: 'Epic', maxLevel: 45, color: 'text-[var(--quality-epic)]' },
	{ title: 'Legendary', maxLevel: 80, color: 'text-[var(--quality-legendary)]' }
];

// Default calculation weights
export const DEFAULT_WEIGHTS: CalculationWeights = {
	aptitude: 2,
	finance: 0,
	command: 2,
	combat: 2,
	leadership: 2
};

// Default profile settings
export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
	hideUnlocked: false,
	suggestUpgrades: true,
	suggestUnlocks: false
};

// Calculation request
export interface CalculationRequest {
	commanders: PlayerCommander[];
	weights: CalculationWeights;
}

// Calculation result
export interface CalculationResult {
	id: string;
	value: number;
	needsUpgrade: boolean;
	needsAwakeningUpgrade: boolean;
	needsUnlock: boolean;
}

// Profile data for import/export
export interface ProfileData {
	commanders: PlayerCommander[];
	weights: CalculationWeights;
}
