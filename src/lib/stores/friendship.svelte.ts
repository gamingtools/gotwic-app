import { browser } from '$app/environment';
import type {
	CalculationWeights,
	MergedCommander,
	PlayerCommander,
	ProfileSettings,
	GiftType
} from '$lib/types';
import { DEFAULT_WEIGHTS, DEFAULT_PROFILE_SETTINGS } from '$lib/types';
import { commanders } from '$lib/data/commanders';
import { calculateNextLevelValues } from '$lib/logic/calculator';

// Storage keys
const PROFILES_KEY = 'gw-fr-profiles';
const PLAYER_COMMANDERS_KEY = 'gw-fr-playerCommanders';
const WEIGHTS_KEY = 'gw-fr-calculationWeights';
const SETTINGS_KEY = 'gw-fr-profileSettings';

function getStorageKey(base: string, profileId: string): string {
	// Match Angular: use base key for 'default', append profileId for others
	return profileId === 'default' ? base : base + profileId;
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue;
	try {
		const stored = localStorage.getItem(key);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch {
		// Ignore parse errors
	}
	return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
	if (!browser) return;
	localStorage.setItem(key, JSON.stringify(value));
}

function removeFromStorage(key: string): void {
	if (!browser) return;
	localStorage.removeItem(key);
}

// Create the friendship store using Svelte 5 runes
function createFriendshipStore() {
	// Compute initial values before creating reactive state (avoids state_referenced_locally warnings)
	// Match Angular: if no profiles or empty array, default to ['default']
	let initialProfiles = loadFromStorage<string[]>(PROFILES_KEY, []);
	if (!initialProfiles || initialProfiles.length === 0) {
		initialProfiles = ['default'];
	}
	const initialProfileId = initialProfiles[0];
	const initialWeights = loadFromStorage<CalculationWeights>(
		getStorageKey(WEIGHTS_KEY, initialProfileId),
		{ ...DEFAULT_WEIGHTS }
	);
	const initialSettings = loadFromStorage<ProfileSettings>(
		getStorageKey(SETTINGS_KEY, initialProfileId),
		{ ...DEFAULT_PROFILE_SETTINGS }
	);
	const initialPlayerCommanders = loadFromStorage<PlayerCommander[]>(
		getStorageKey(PLAYER_COMMANDERS_KEY, initialProfileId),
		[]
	);

	// Initialize merged commanders from initial data
	const initialMergedCommanders = commanders
		.map((commander) => {
			const existingPc = initialPlayerCommanders.find((pc) => pc.id === commander.id);
			const playerCommander: PlayerCommander = {
				id: commander.id,
				currentLevel: 0,
				maxLevel: 0,
				awakeningLevel: 0,
				...existingPc
			};

			return {
				...commander,
				playerCommander,
				cost: 0,
				needsUnlock: false,
				needsUpgrade: false,
				needsAwakeningUpgrade: false
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	// Create reactive state from computed initial values
	let profiles = $state<string[]>(initialProfiles);
	let currentProfileId = $state<string>(initialProfileId);
	let weights = $state<CalculationWeights>(initialWeights);
	let profileSettings = $state<ProfileSettings>(initialSettings);
	let mergedCommanders = $state<MergedCommander[]>(initialMergedCommanders);
	let lastSaved = $state<number>(0);

	function recalculateCosts(): void {
		const results = calculateNextLevelValues({
			commanders: mergedCommanders.map((mc) => mc.playerCommander),
			weights
		});

		for (const mc of mergedCommanders) {
			const result = results.find((r) => r.id === mc.id);
			if (result) {
				mc.cost = result.value;
				mc.needsUnlock = result.needsUnlock;
				mc.needsUpgrade = result.needsUpgrade;
				mc.needsAwakeningUpgrade = result.needsAwakeningUpgrade;
			}
		}
	}

	function savePlayerCommanders(): void {
		saveToStorage(
			getStorageKey(PLAYER_COMMANDERS_KEY, currentProfileId),
			mergedCommanders.map((mc) => mc.playerCommander)
		);
		recalculateCosts();
		lastSaved = Date.now();
	}

	function saveWeights(): void {
		saveToStorage(getStorageKey(WEIGHTS_KEY, currentProfileId), weights);
		recalculateCosts();
		lastSaved = Date.now();
	}

	function saveProfileSettings(): void {
		saveToStorage(getStorageKey(SETTINGS_KEY, currentProfileId), profileSettings);
		lastSaved = Date.now();
	}

	function saveProfiles(): void {
		saveToStorage(PROFILES_KEY, profiles);
	}

	function loadProfile(profileId: string): void {
		currentProfileId = profileId;

		weights = loadFromStorage(getStorageKey(WEIGHTS_KEY, profileId), { ...DEFAULT_WEIGHTS });

		profileSettings = loadFromStorage(getStorageKey(SETTINGS_KEY, profileId), {
			...DEFAULT_PROFILE_SETTINGS
		});

		const playerCommanders: PlayerCommander[] = loadFromStorage(
			getStorageKey(PLAYER_COMMANDERS_KEY, profileId),
			[]
		);

		for (const mc of mergedCommanders) {
			const existingPc = playerCommanders.find((pc) => pc.id === mc.id);
			mc.playerCommander = {
				id: mc.id,
				currentLevel: 0,
				maxLevel: 0,
				awakeningLevel: 0,
				...existingPc
			};
		}

		recalculateCosts();
	}

	// Initialize costs on load
	if (browser) {
		recalculateCosts();
	}

	return {
		// Getters
		get profiles() {
			return profiles;
		},
		get currentProfileId() {
			return currentProfileId;
		},
		get weights() {
			return weights;
		},
		get profileSettings() {
			return profileSettings;
		},
		get mergedCommanders() {
			return mergedCommanders;
		},
		get visibleCommanders() {
			if (profileSettings.hideUnlocked) {
				return mergedCommanders.filter((mc) => mc.playerCommander.maxLevel > 0);
			}
			return mergedCommanders;
		},
		get lastSaved() {
			return lastSaved;
		},

		// Profile management
		changeProfile(profileId: string): void {
			loadProfile(profileId);
		},

		addProfile(name: string): boolean {
			const sanitized = name.replace(/[\W_]+/g, '');
			if (!sanitized || profiles.includes(sanitized)) {
				return false;
			}
			profiles = [...profiles, sanitized];
			saveProfiles();
			loadProfile(sanitized);
			return true;
		},

		deleteProfile(): boolean {
			if (profiles.length <= 1) {
				return false;
			}

			removeFromStorage(getStorageKey(PLAYER_COMMANDERS_KEY, currentProfileId));
			removeFromStorage(getStorageKey(WEIGHTS_KEY, currentProfileId));
			removeFromStorage(getStorageKey(SETTINGS_KEY, currentProfileId));

			profiles = profiles.filter((p) => p !== currentProfileId);
			saveProfiles();
			loadProfile(profiles[0]);
			return true;
		},

		// Commander updates
		updateMaxLevel(commanderId: string, maxLevel: number): void {
			const mc = mergedCommanders.find((c) => c.id === commanderId);
			if (mc) {
				mc.playerCommander.maxLevel = maxLevel;
				if (maxLevel > 0 && mc.playerCommander.currentLevel === 0) {
					mc.playerCommander.currentLevel = 1;
				}
				if (maxLevel === 0) {
					mc.playerCommander.currentLevel = 0;
				}
				savePlayerCommanders();
			}
		},

		updateCurrentLevel(commanderId: string, level: number): void {
			const mc = mergedCommanders.find((c) => c.id === commanderId);
			if (mc) {
				mc.playerCommander.currentLevel = Math.max(
					1,
					Math.min(level, mc.playerCommander.maxLevel)
				);
				savePlayerCommanders();
			}
		},

		increaseLevel(commanderId: string): void {
			const mc = mergedCommanders.find((c) => c.id === commanderId);
			if (mc && mc.playerCommander.currentLevel < mc.playerCommander.maxLevel) {
				mc.playerCommander.currentLevel++;
				savePlayerCommanders();
			}
		},

		decreaseLevel(commanderId: string): void {
			const mc = mergedCommanders.find((c) => c.id === commanderId);
			if (mc && mc.playerCommander.currentLevel > 1) {
				mc.playerCommander.currentLevel--;
				savePlayerCommanders();
			}
		},

		updateAwakeningLevel(commanderId: string, level: number): void {
			const mc = mergedCommanders.find((c) => c.id === commanderId);
			if (mc) {
				mc.playerCommander.awakeningLevel = level;
				savePlayerCommanders();
			}
		},

		// Weights updates
		updateWeight(key: keyof CalculationWeights, value: number): void {
			weights[key] = Math.max(0, Math.min(10, value));
			saveWeights();
		},

		// Settings updates
		updateSetting<K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]): void {
			profileSettings[key] = value;
			saveProfileSettings();
		},

		// Get commanders by gift type for priority display
		getCommandersByGiftType(giftType: GiftType): MergedCommander[] {
			let filtered = mergedCommanders.filter(
				(mc) => mc.preferredGift === giftType && mc.cost >= 0
			);

			if (!profileSettings.suggestUnlocks) {
				filtered = filtered.filter((mc) => !mc.needsUnlock);
			}
			if (!profileSettings.suggestUpgrades) {
				filtered = filtered.filter((mc) => !mc.needsUpgrade && !mc.needsAwakeningUpgrade);
			}

			return filtered.sort((a, b) => b.cost - a.cost);
		},

		// Import/Export
		exportProfile(): string {
			return JSON.stringify({
				commanders: mergedCommanders.map((mc) => mc.playerCommander),
				weights
			});
		},

		importProfile(data: string): boolean {
			try {
				const parsed = JSON.parse(data);
				if (parsed && parsed.commanders && parsed.weights) {
					// Update player commanders
					for (const mc of mergedCommanders) {
						const imported = parsed.commanders.find(
							(pc: PlayerCommander) => pc.id === mc.id
						);
						if (imported) {
							mc.playerCommander = {
								id: mc.id,
								currentLevel: 0,
								maxLevel: 0,
								awakeningLevel: 0,
								...imported
							};
						}
					}
					savePlayerCommanders();

					// Update weights
					weights = { ...DEFAULT_WEIGHTS, ...parsed.weights };
					saveWeights();

					return true;
				}
			} catch {
				// Ignore parse errors
			}
			return false;
		},

		// Reset profile data
		resetProfile(): void {
			weights = { ...DEFAULT_WEIGHTS };
			saveWeights();

			for (const mc of mergedCommanders) {
				mc.playerCommander = {
					id: mc.id,
					currentLevel: 0,
					maxLevel: 0,
					awakeningLevel: 0
				};
			}
			savePlayerCommanders();
		}
	};
}

export const friendshipStore = createFriendshipStore();
