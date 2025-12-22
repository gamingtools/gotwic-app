<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';
	import StarRating from './StarRating.svelte';
	import { COMMANDER_QUALITIES } from '$lib/types';

	function getRange(max: number): number[] {
		return Array.from({ length: max }, (_, i) => i + 1);
	}

	function getQualityBgClass(maxLevel: number): string {
		const qualityMap: Record<number, string> = {
			0: 'bg-[var(--quality-none)]/20',
			10: 'bg-[var(--quality-common)]/20',
			20: 'bg-[var(--quality-uncommon)]/20',
			30: 'bg-[var(--quality-rare)]/20',
			45: 'bg-[var(--quality-epic)]/20',
			80: 'bg-[var(--quality-legendary)]/20'
		};
		return qualityMap[maxLevel] || '';
	}

	function getQualityBorderClass(maxLevel: number): string {
		const qualityMap: Record<number, string> = {
			0: 'border-[var(--quality-none)]/30',
			10: 'border-[var(--quality-common)]/30',
			20: 'border-[var(--quality-uncommon)]/30',
			30: 'border-[var(--quality-rare)]/30',
			45: 'border-[var(--quality-epic)]/30',
			80: 'border-[var(--quality-legendary)]/30'
		};
		return qualityMap[maxLevel] || '';
	}
</script>

<div class="panel overflow-hidden">
	<div class="max-h-[400px] overflow-y-auto overflow-x-auto lg:max-h-none">
		<table class="w-full text-sm lg:text-base">
			<thead>
				<tr class="border-b border-[var(--color-gold)]/20 bg-gradient-to-r from-[var(--color-gold)]/10 via-[var(--color-gold)]/5 to-[var(--color-gold)]/10">
					<th class="whitespace-nowrap pl-3 pr-2 lg:px-4 py-2 lg:py-3 text-left font-display text-sm font-medium tracking-wide text-[var(--color-gold)]">Name</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)] sm:table-cell">Gift</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)] xl:table-cell">Apt</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)] xl:table-cell">Fin</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)] xl:table-cell">Cmd</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)] xl:table-cell">Cmbt</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)] xl:table-cell">Lead</th>
					<th class="whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)]">Quality</th>
					<th class="whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)]">Level</th>
					<th class="whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center font-display text-sm font-medium tracking-wide text-[var(--color-gold)]">Awaken</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[var(--color-gold)]/10">
				{#each friendshipStore.visibleCommanders as commander (commander.id)}
					<tr class="table-row-hover {getQualityBgClass(commander.playerCommander.maxLevel)}">
						<!-- Name -->
						<td class="whitespace-nowrap pl-3 pr-2 lg:px-4 py-2 lg:py-3 font-semibold text-[var(--color-parchment)]">{commander.name}</td>

						<!-- Gift Type -->
						<td class="hidden whitespace-nowrap px-2 lg:px-4 py-2 lg:py-3 text-center text-[var(--color-ash)] sm:table-cell">{commander.preferredGift}</td>

						<!-- Stats (hidden on smaller screens) -->
						<td class="hidden px-2 lg:px-4 py-2 lg:py-3 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.aptitude} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-4 py-2 lg:py-3 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.finance} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-4 py-2 lg:py-3 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.command} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-4 py-2 lg:py-3 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.combat} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-4 py-2 lg:py-3 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.leadership} />
							</div>
						</td>

						<!-- Quality -->
						<td class="px-2 lg:px-4 py-2 lg:py-3">
							<div class="flex justify-center">
								<select
									value={commander.playerCommander.maxLevel}
									onchange={(e) =>
										friendshipStore.updateMaxLevel(
											commander.id,
											parseInt((e.target as HTMLSelectElement).value)
										)}
									class="w-28 cursor-pointer rounded border border-[var(--color-gold)]/20 bg-[var(--color-void)]/60 px-1 lg:px-2 py-1 lg:py-1.5 text-left text-sm lg:text-base text-[var(--color-parchment)] transition-colors focus:border-[var(--color-gold)]/50 focus:outline-none {getQualityBorderClass(commander.playerCommander.maxLevel)}"
								>
									{#each COMMANDER_QUALITIES as quality}
										<option value={quality.maxLevel} class="bg-[var(--color-slate)] {quality.color}">
											{quality.title}
										</option>
									{/each}
								</select>
							</div>
						</td>

						<!-- Level -->
						<td class="px-2 lg:px-4 py-2 lg:py-3">
							{#if commander.playerCommander.maxLevel > 0}
								<div class="flex items-center justify-center gap-1.5">
									<button
										onclick={() => friendshipStore.decreaseLevel(commander.id)}
										disabled={commander.playerCommander.currentLevel <= 1}
										aria-label="Decrease level"
										class="flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 text-base lg:text-lg text-[var(--color-gold)] transition-all hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-gold)]/20 disabled:cursor-not-allowed disabled:opacity-30"
									>
										-
									</button>
									<select
										value={commander.playerCommander.currentLevel}
										onchange={(e) =>
											friendshipStore.updateCurrentLevel(
												commander.id,
												parseInt((e.target as HTMLSelectElement).value)
											)}
										class="w-16 cursor-pointer rounded border border-[var(--color-gold)]/20 bg-[var(--color-void)]/60 px-1 py-1 lg:py-1.5 text-sm lg:text-base tabular-nums text-[var(--color-parchment)] transition-colors focus:border-[var(--color-gold)]/50 focus:outline-none"
									>
										{#each getRange(commander.playerCommander.maxLevel) as level}
											<option value={level} class="bg-[var(--color-slate)]">{level}</option>
										{/each}
									</select>
									<button
										onclick={() => friendshipStore.increaseLevel(commander.id)}
										disabled={commander.playerCommander.currentLevel >= commander.playerCommander.maxLevel}
										aria-label="Increase level"
										class="flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 text-base lg:text-lg text-[var(--color-gold)] transition-all hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-gold)]/20 disabled:cursor-not-allowed disabled:opacity-30"
									>
										+
									</button>
								</div>
							{:else}
								<span class="block text-center text-[var(--color-steel)]">-</span>
							{/if}
						</td>

						<!-- Awakening -->
						<td class="px-2 lg:px-4 py-2 lg:py-3">
							<div class="flex justify-center">
								{#if commander.awakable}
									<select
										value={commander.playerCommander.awakeningLevel}
										onchange={(e) =>
											friendshipStore.updateAwakeningLevel(
												commander.id,
												parseInt((e.target as HTMLSelectElement).value)
											)}
										class="w-16 cursor-pointer rounded border border-[var(--color-gold)]/20 bg-[var(--color-void)]/60 px-1 py-1 lg:py-1.5 text-sm lg:text-base tabular-nums text-[var(--color-parchment)] transition-colors focus:border-[var(--color-gold)]/50 focus:outline-none"
									>
										<option value="0" class="bg-[var(--color-slate)]">-</option>
										<option value="1" class="bg-[var(--color-slate)]">1</option>
										<option value="2" class="bg-[var(--color-slate)]">2</option>
										<option value="3" class="bg-[var(--color-slate)]">3</option>
										<option value="4" class="bg-[var(--color-slate)]">4</option>
									</select>
								{:else}
									<span class="text-[var(--color-steel)]">-</span>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
