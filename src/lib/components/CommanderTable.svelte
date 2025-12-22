<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';
	import StarRating from './StarRating.svelte';
	import { COMMANDER_QUALITIES } from '$lib/types';

	let searchQuery = $state('');
	let tableContainer: HTMLDivElement;
	let showScrollHint = $state(false);

	// Check if table needs horizontal scroll on mount
	$effect(() => {
		if (tableContainer) {
			const checkScroll = () => {
				showScrollHint = tableContainer.scrollWidth > tableContainer.clientWidth && tableContainer.scrollLeft === 0;
			};
			checkScroll();
			tableContainer.addEventListener('scroll', checkScroll);
			window.addEventListener('resize', checkScroll);
			return () => {
				tableContainer.removeEventListener('scroll', checkScroll);
				window.removeEventListener('resize', checkScroll);
			};
		}
	});

	let filteredCommanders = $derived(
		searchQuery.trim()
			? friendshipStore.visibleCommanders.filter(c =>
				c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.preferredGift.toLowerCase().includes(searchQuery.toLowerCase())
			)
			: friendshipStore.visibleCommanders
	);

	function getRange(max: number): number[] {
		return Array.from({ length: max }, (_, i) => i + 1);
	}

	function getQualityBgClass(maxLevel: number): string {
		const qualityMap: Record<number, string> = {
			0: 'bg-(--quality-none)/20',
			10: 'bg-(--quality-common)/20',
			20: 'bg-(--quality-uncommon)/20',
			30: 'bg-(--quality-rare)/20',
			45: 'bg-(--quality-epic)/20',
			80: 'bg-(--quality-legendary)/20'
		};
		return qualityMap[maxLevel] || '';
	}

	function getQualityBorderClass(maxLevel: number): string {
		const qualityMap: Record<number, string> = {
			0: 'border-(--quality-none)/30',
			10: 'border-(--quality-common)/30',
			20: 'border-(--quality-uncommon)/30',
			30: 'border-(--quality-rare)/30',
			45: 'border-(--quality-epic)/30',
			80: 'border-(--quality-legendary)/30'
		};
		return qualityMap[maxLevel] || '';
	}
</script>

<div class="panel overflow-hidden">
	<!-- Search bar -->
	<div class="border-b border-(--color-gold)/10 px-3 py-2 lg:px-3">
		<div class="relative">
			<svg class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-ash)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search commanders..."
				class="w-full rounded border border-(--color-gold)/20 bg-(--color-void)/60 py-1.5 pl-9 pr-3 text-sm text-(--color-parchment) placeholder-(--color-ash)/60 transition-colors focus:border-(--color-gold)/50 focus:outline-none"
			/>
			{#if searchQuery}
				<button
					onclick={() => searchQuery = ''}
					class="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--color-ash) hover:text-(--color-parchment)"
					aria-label="Clear search"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Scroll hint for mobile -->
	{#if showScrollHint}
		<div class="flex items-center justify-center gap-2 border-b border-(--color-gold)/10 bg-(--color-gold)/5 px-3 py-1.5 text-xs text-(--color-ash) lg:hidden">
			<svg class="h-4 w-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
			</svg>
			<span>Swipe to see more columns</span>
		</div>
	{/if}

	<div bind:this={tableContainer} class="max-h-100 overflow-y-auto overflow-x-auto pb-2 md:pb-0 lg:max-h-none">
		<table class="w-full text-sm lg:text-base">
			<thead>
				<tr class="border-b border-(--color-gold)/20 bg-linear-to-r from-(--color-gold)/10 via-(--color-gold)/5 to-(--color-gold)/10">
					<th class="whitespace-nowrap pl-3 pr-2 lg:px-3 py-2 text-left font-display text-sm font-medium tracking-wide text-(--color-gold)">Name</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold) sm:table-cell">Gift</th>
					<th class="hidden whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold) xl:table-cell"><span class="2xl:hidden">Apt</span><span class="hidden 2xl:inline">Aptitude</span></th>
					<th class="hidden whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold) xl:table-cell"><span class="2xl:hidden">Fin</span><span class="hidden 2xl:inline">Finance</span></th>
					<th class="hidden whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold) xl:table-cell"><span class="2xl:hidden">Cmd</span><span class="hidden 2xl:inline">Command</span></th>
					<th class="hidden whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold) xl:table-cell"><span class="2xl:hidden">Cmbt</span><span class="hidden 2xl:inline">Combat</span></th>
					<th class="hidden whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold) xl:table-cell"><span class="2xl:hidden">Lead</span><span class="hidden 2xl:inline">Leadership</span></th>
					<th class="whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold)">Quality</th>
					<th class="whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold)">Level</th>
					<th class="whitespace-nowrap px-2 lg:px-3 py-2 text-center font-display text-sm font-medium tracking-wide text-(--color-gold)"><span class="2xl:hidden">Awaken</span><span class="hidden 2xl:inline">Awakening</span></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-(--color-gold)/10">
				{#each filteredCommanders as commander (commander.id)}
					<tr class="table-row-hover {getQualityBgClass(commander.playerCommander.maxLevel)}">
						<!-- Name -->
						<td class="whitespace-nowrap pl-3 pr-2 lg:px-3 py-1 font-semibold text-(--color-parchment)">{commander.name}</td>

						<!-- Gift Type -->
						<td class="hidden whitespace-nowrap px-2 lg:px-3 py-1 text-center text-(--color-ash) sm:table-cell">{commander.preferredGift}</td>

						<!-- Stats (hidden on smaller screens) -->
						<td class="hidden px-2 lg:px-3 py-1 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.aptitude} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-3 py-1 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.finance} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-3 py-1 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.command} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-3 py-1 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.combat} />
							</div>
						</td>
						<td class="hidden px-2 lg:px-3 py-1 xl:table-cell">
							<div class="flex justify-center">
								<StarRating value={commander.leadership} />
							</div>
						</td>

						<!-- Quality -->
						<td class="px-2 lg:px-3 py-1">
							<div class="flex justify-center">
								<select
									value={commander.playerCommander.maxLevel}
									onchange={(e) =>
										friendshipStore.updateMaxLevel(
											commander.id,
											parseInt((e.target as HTMLSelectElement).value)
										)}
									class="w-28 cursor-pointer rounded border border-(--color-gold)/20 bg-(--color-void)/60 px-1 lg:px-2 py-1 lg:py-1.5 text-left text-sm lg:text-base text-(--color-parchment) transition-colors focus:border-(--color-gold)/50 focus:outline-none {getQualityBorderClass(commander.playerCommander.maxLevel)}"
								>
									{#each COMMANDER_QUALITIES as quality}
										<option value={quality.maxLevel} class="bg-(--color-slate) {quality.color}">
											{quality.title}
										</option>
									{/each}
								</select>
							</div>
						</td>

						<!-- Level -->
						<td class="px-2 lg:px-3 py-1">
							{#if commander.playerCommander.maxLevel > 0}
								<div class="flex items-center justify-center gap-1.5">
									<button
										onclick={() => friendshipStore.decreaseLevel(commander.id)}
										disabled={commander.playerCommander.currentLevel <= 1}
										aria-label="Decrease level"
										class="flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded border border-(--color-gold)/20 bg-(--color-gold)/10 text-base lg:text-lg text-(--color-gold) transition-all hover:border-(--color-gold)/40 hover:bg-(--color-gold)/20 disabled:cursor-not-allowed disabled:opacity-30"
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
										class="w-16 cursor-pointer rounded border border-(--color-gold)/20 bg-(--color-void)/60 px-1 lg:px-2 py-1 lg:py-1.5 text-sm lg:text-base tabular-nums text-(--color-parchment) transition-colors focus:border-(--color-gold)/50 focus:outline-none"
									>
										{#each getRange(commander.playerCommander.maxLevel) as level}
											<option value={level} class="bg-(--color-slate)">{level}</option>
										{/each}
									</select>
									<button
										onclick={() => friendshipStore.increaseLevel(commander.id)}
										disabled={commander.playerCommander.currentLevel >= commander.playerCommander.maxLevel}
										aria-label="Increase level"
										class="flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded border border-(--color-gold)/20 bg-(--color-gold)/10 text-base lg:text-lg text-(--color-gold) transition-all hover:border-(--color-gold)/40 hover:bg-(--color-gold)/20 disabled:cursor-not-allowed disabled:opacity-30"
									>
										+
									</button>
								</div>
							{:else}
								<span class="block text-center text-(--color-steel)">-</span>
							{/if}
						</td>

						<!-- Awakening -->
						<td class="px-2 lg:px-3 py-1">
							<div class="flex justify-center">
								{#if commander.awakable}
									<select
										value={commander.playerCommander.awakeningLevel}
										onchange={(e) =>
											friendshipStore.updateAwakeningLevel(
												commander.id,
												parseInt((e.target as HTMLSelectElement).value)
											)}
										class="w-16 cursor-pointer rounded border border-(--color-gold)/20 bg-(--color-void)/60 px-1 lg:px-2 py-1 lg:py-1.5 text-sm lg:text-base tabular-nums text-(--color-parchment) transition-colors focus:border-(--color-gold)/50 focus:outline-none"
									>
										<option value={0} class="bg-(--color-slate)">-</option>
										<option value={1} class="bg-(--color-slate)">1</option>
										<option value={2} class="bg-(--color-slate)">2</option>
										<option value={3} class="bg-(--color-slate)">3</option>
										<option value={4} class="bg-(--color-slate)">4</option>
									</select>
								{:else}
									<span class="text-(--color-steel)">-</span>
								{/if}
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="10" class="px-4 py-8 text-center text-(--color-ash)">
							{#if searchQuery}
								No commanders found matching "{searchQuery}"
							{:else}
								No commanders available
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
