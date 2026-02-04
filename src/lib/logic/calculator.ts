import type {
	CalculationWeights,
	PlayerCommander,
	CalculationResult,
	CalculationRequest
} from '$lib/types';
import { MAX_AWAKENING_LEVEL } from '$lib/types';
import { getCommanderById } from '$lib/data/commanders';

// Calculate XP points needed to level up from one level to another
function getLevelPoints(level: number): number {
	if (level <= 40) {
		return level * 10 + 40;
	}

	const levelCosts: Record<number, number> = {
		41: 460,
		42: 480,
		43: 500,
		44: 520,
		45: 560,
		46: 600,
		47: 650,
		48: 700,
		49: 800,
		50: 1000,
		51: 1240,
		52: 1500,
		53: 1800,
		54: 2100,
		55: 2500,
		56: 3000,
		57: 3600,
		58: 4200,
		59: 5000
	};

	if (levelCosts[level]) {
		return levelCosts[level];
	}

	// Levels 60-79 all cost 5000
	if (level >= 60 && level <= 79) {
		return 5000;
	}

	// Level 80 is prohibitively expensive (max level)
	if (level === 80) {
		return 50000000000;
	}

	return 0;
}

// Calculate total points needed to level from one level to another
export function pointsToLevel(from: number, to: number): number {
	let result = 0;
	for (let i = from; i < to; i++) {
		result += getLevelPoints(i);
	}
	return result;
}

// Check if awakening level gives bonus stats
function isStarredAwakening(awakeningLevel: number | undefined): boolean {
	if (!awakeningLevel) {
		return false;
	}
	return awakeningLevel >= 2;
}

// Get max level based on awakening level (60 base + 5 per awakening level)
export function getAwakeningMaxLevel(awakeningLevel: number | undefined): number {
	return 60 + (awakeningLevel ?? 0) * 5;
}

// Check if a commander is fully completed (max quality, max level, max awakening)
export function isCommanderCompleted(pc: PlayerCommander): boolean {
	const awakeningMax = getAwakeningMaxLevel(MAX_AWAKENING_LEVEL);
	return pc.maxLevel === awakeningMax && pc.currentLevel === awakeningMax && pc.awakeningLevel === MAX_AWAKENING_LEVEL;
}

// Calculate the value for upgrading a commander to the next level
export function getValueForNextLevel(
	playerCommander: PlayerCommander,
	weights: CalculationWeights
): number {
	// Effective max is the lower of quality-based max and awakening-based max
	const awakeningMax = getAwakeningMaxLevel(playerCommander.awakeningLevel);
	const effectiveMax = Math.min(playerCommander.maxLevel, awakeningMax);

	if (playerCommander.currentLevel >= effectiveMax) {
		return 0;
	}

	const commander = getCommanderById(playerCommander.id);
	if (!commander) {
		return 0;
	}

	const pointsNeeded = pointsToLevel(playerCommander.currentLevel, playerCommander.currentLevel + 1);
	if (pointsNeeded === 0) {
		return 0;
	}

	const hasAwakeningBonus = isStarredAwakening(playerCommander.awakeningLevel);

	const aptitude =
		weights.aptitude *
		(commander.aptitude + (commander.aptitude > 0 && hasAwakeningBonus ? 1 : 0));
	const finance =
		weights.finance * (commander.finance + (commander.finance > 0 && hasAwakeningBonus ? 1 : 0));
	const command =
		weights.command * (commander.command + (commander.command > 0 && hasAwakeningBonus ? 1 : 0));
	const combat =
		weights.combat * (commander.combat + (commander.combat > 0 && hasAwakeningBonus ? 1 : 0));
	const leadership =
		weights.leadership *
		(commander.leadership + (commander.leadership > 0 && hasAwakeningBonus ? 1 : 0));

	return Math.round(((aptitude + finance + command + combat + leadership) / pointsNeeded) * 1000);
}

// Calculate values for all commanders
export function calculateNextLevelValues(request: CalculationRequest): CalculationResult[] {
	return request.commanders.map((pc) => ({
		id: pc.id,
		value: getValueForNextLevel(pc, request.weights),
		// Needs upgrade if at max level for current quality, but not at Legendary (80) since that's the max
		needsUpgrade: pc.currentLevel === pc.maxLevel && pc.currentLevel !== 0 && pc.maxLevel !== 80,
		needsUnlock: pc.maxLevel === 0
	}));
}
