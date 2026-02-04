<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';
</script>

<div class="panel overflow-hidden">
	<div class="panel-header px-4 py-2.5">
		<h3 class="font-display font-bold tracking-wide text-(--color-gold)">Settings</h3>
	</div>
	<div class="divide-y divide-(--color-gold)/10">
		<label class="table-row-hover flex cursor-pointer items-center gap-3 px-4 py-3">
			<input
				type="checkbox"
				checked={friendshipStore.profileSettings.hideUnlocked}
				onchange={(e) =>
					friendshipStore.updateSetting('hideUnlocked', (e.target as HTMLInputElement).checked)}
				class="checkbox-gold"
			/>
			<span class="text-(--color-parchment)">Hide Locked Commanders</span>
		</label>
		<label class="table-row-hover flex cursor-pointer items-center gap-3 px-4 py-3">
			<input
				type="checkbox"
				checked={friendshipStore.profileSettings.hideCompleted}
				onchange={(e) =>
					friendshipStore.updateSetting('hideCompleted', (e.target as HTMLInputElement).checked)}
				class="checkbox-gold"
			/>
			<span class="text-(--color-parchment)">Hide Completed Commanders</span>
		</label>
		<label class="table-row-hover flex cursor-pointer items-center gap-3 px-4 py-3">
			<input
				type="checkbox"
				checked={friendshipStore.profileSettings.suggestUpgrades}
				onchange={(e) =>
					friendshipStore.updateSetting('suggestUpgrades', (e.target as HTMLInputElement).checked)}
				class="checkbox-gold"
			/>
			<span class="text-(--color-parchment)">Suggest Quality Upgrades</span>
		</label>
		<label class="table-row-hover flex cursor-pointer items-center gap-3 px-4 py-3">
			<input
				type="checkbox"
				checked={friendshipStore.profileSettings.suggestUnlocks}
				onchange={(e) =>
					friendshipStore.updateSetting('suggestUnlocks', (e.target as HTMLInputElement).checked)}
				class="checkbox-gold"
			/>
			<span class="text-(--color-parchment)">Suggest Commander Unlocks</span>
		</label>
	</div>
</div>
