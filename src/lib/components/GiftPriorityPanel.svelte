<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';
	import type { GiftType } from '$lib/types';

	interface Props {
		giftType: GiftType;
	}

	let { giftType }: Props = $props();

	let commanders = $derived(friendshipStore.getCommandersByGiftType(giftType));

	const giftIcons: Record<string, string> = {
		Book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
		Dessert: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z',
		Drink: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
		Food: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		Jewelry: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		Weapon: 'M13 10V3L4 14h7v7l9-11h-7z'
	};
</script>

<div class="panel overflow-hidden">
	<div class="panel-header flex items-center justify-between px-4 py-2.5">
		<div class="flex items-center gap-2">
			<svg class="h-4 w-4 text-(--color-gold)/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={giftIcons[giftType] || giftIcons.Book} />
			</svg>
			<h3 class="font-display font-bold tracking-wide text-(--color-gold)">{giftType}</h3>
		</div>
		<button
			class="text-(--color-ash) transition-colors hover:text-(--color-gold)"
			title="Shows commanders who prefer this gift, sorted by upgrade value. Higher = better value."
			aria-label="Gift priority info"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</button>
	</div>
	<div class="divide-y divide-(--color-gold)/10">
		{#if commanders.length === 0}
			<div class="px-4 py-3 text-center text-(--color-ash)">No commanders available</div>
		{:else}
			{#each commanders as commander, index}
				<div class="table-row-hover flex items-center justify-between px-4 py-2">
					<div class="flex items-center gap-2">
						<span class="flex h-5 w-5 items-center justify-center rounded-full bg-(--color-gold)/10 text-xs text-(--color-gold)/70">
							{index + 1}
						</span>
						<span class="text-(--color-parchment)">{commander.name}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="rounded bg-(--color-gold)/15 px-2 py-0.5 text-xs font-bold tabular-nums text-(--color-gold)">
							{commander.cost}
						</span>
						{#if commander.needsUnlock}
							<span class="text-(--color-crimson)" title="Needs Unlock">
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
						{/if}
						{#if commander.needsAwakeningUpgrade}
							<span class="text-(--quality-epic)" title="Needs Awakening Upgrade">
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
						{:else if commander.needsUpgrade}
							<span class="text-(--quality-uncommon)" title="Needs Quality Upgrade">
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
