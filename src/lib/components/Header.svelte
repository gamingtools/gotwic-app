<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import { base } from '$app/paths';
	import SigninDropdown from './auth/SigninDropdown.svelte';

	function handleProfileChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		friendshipStore.changeProfile(target.value);
		toastStore.info(`Switched to ${target.value}`);
	}

	let showGuide = $state(false);

	$effect(() => {
		if (showGuide) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<!-- Header Bar -->
<header class="sticky top-0 z-40 border-b border-(--color-gold)/20 bg-(--color-obsidian)/95 backdrop-blur-sm">
	<!-- Top decorative line -->
	<div class="h-px bg-gradient-to-r from-transparent via-(--color-gold)/40 to-transparent"></div>

	<div class="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
		<!-- Left: Title -->
		<div class="flex items-center gap-2">
			<div class="flex h-8 w-8 items-center justify-center rounded border border-(--color-gold)/30 bg-(--color-gold)/10">
				<svg class="h-4 w-4 text-(--color-gold)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
				</svg>
			</div>
			<h1 class="font-got text-base lg:text-lg tracking-wide text-(--color-gold)">Friendship Calculator</h1>
		</div>

		<!-- Right: Profile + Actions + Sign in -->
		<div class="flex items-center gap-2">
			<div class="flex items-center gap-2 rounded border border-(--color-gold)/20 bg-(--color-void)/50 px-2 py-1">
				<svg class="h-4 w-4 text-(--color-ash)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				<select
					class="cursor-pointer border-none bg-transparent pr-6 text-xs lg:text-sm text-(--color-parchment) focus:outline-none"
					onchange={handleProfileChange}
					value={friendshipStore.currentProfileId}
				>
					{#each friendshipStore.profiles as profile (profile)}
						<option value={profile} class="bg-(--color-slate) text-(--color-parchment)">{profile}</option>
					{/each}
				</select>
				{#if friendshipStore.cloudMode}
					<svg class="h-3.5 w-3.5 text-(--color-gold)/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Cloud synced">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
					</svg>
				{/if}
			</div>

			<a
				href="{base}/friendship/profiles"
				class="flex items-center gap-1.5 rounded border border-(--color-steel) bg-(--color-slate) px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm text-(--color-ash) transition-all hover:border-(--color-gold)/30 hover:text-(--color-parchment)"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<span class="hidden sm:inline">Manage</span>
			</a>

			<div class="mx-0.5 hidden h-6 w-px bg-(--color-steel)/50 sm:block"></div>

			<a
				href="https://gaming.tools/discord"
				target="_blank"
				rel="noopener noreferrer"
				class="flex h-8 w-8 items-center justify-center rounded text-(--color-ash) transition-colors hover:text-[#5865F2]"
				aria-label="Discord"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
				</svg>
			</a>

			<button
				onclick={() => (showGuide = true)}
				class="flex h-8 w-8 items-center justify-center rounded text-(--color-ash) transition-colors hover:text-(--color-parchment)"
				aria-label="Guide"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</button>

			<div class="h-5 w-px bg-(--color-steel)/40"></div>

			<SigninDropdown />
		</div>
	</div>

	<!-- Bottom decorative line -->
	<div class="h-px bg-gradient-to-r from-transparent via-(--color-gold)/20 to-transparent"></div>
</header>

<!-- Guide Modal -->
{#if showGuide}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-(--color-void)/80 p-4 backdrop-blur-sm"
		onclick={(e) => e.target === e.currentTarget && (showGuide = false)}
		onkeydown={(e) => e.key === 'Escape' && (showGuide = false)}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="panel animate-fade-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden p-6">
			<!-- Header -->
			<div class="mb-6 flex shrink-0 items-start justify-between">
				<div>
					<h2 class="font-got text-2xl text-(--color-gold)">Tavern Friendship Calculator</h2>
					<p class="mt-1 text-sm text-(--color-ash)">for Game of Thrones - Winter is Coming Browser Game</p>
				</div>
				<button
					onclick={() => (showGuide = false)}
					aria-label="Close guide"
					class="flex h-8 w-8 items-center justify-center rounded border border-(--color-steel) text-(--color-ash) transition-colors hover:border-(--color-crimson) hover:text-(--color-crimson)"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="space-y-6 overflow-y-auto text-(--color-parchment)">
				<section>
					<h3 class="mb-3 font-display text-xl text-(--color-gold-bright)">What is it for?</h3>
					<ul class="space-y-2 text-base text-(--color-ash)">
						<li class="flex items-start gap-2">
							<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-gold)"></span>
							To perfectly distribute gifts to commanders for max benefit.
						</li>
						<li class="flex items-start gap-2">
							<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-gold)"></span>
							To help decide which commander to upgrade / unlock next.
						</li>
					</ul>
				</section>

				<section>
					<h3 class="mb-3 font-display text-xl text-(--color-gold-bright)">How to use?</h3>

					<h4 class="mb-2 font-semibold text-(--color-parchment)">First time setup</h4>
					<ol class="mb-5 space-y-2.5 text-base text-(--color-ash)">
						<li>
							<span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--color-gold)/20 text-sm text-(--color-gold)">1</span>
							If you have more than one account, create a profile for each by clicking 'Add'.
						</li>
						<li>
							<span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--color-gold)/20 text-sm text-(--color-gold)">2</span>
							Select Quality for each commander you have unlocked in the game.
						</li>
						<li>
							<span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--color-gold)/20 text-sm text-(--color-gold)">3</span>
							Enter the Friendship Level for each commander.
						</li>
						<li>
							<span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--color-gold)/20 text-sm text-(--color-gold)">4</span>
							Set the Weights based on your priorities.
						</li>
					</ol>

					<h4 class="mb-2 font-semibold text-(--color-parchment)">Everyday use</h4>
					<ol class="space-y-1.5 text-base text-(--color-ash)">
						<li>1. Find the gift section matching your gift type on the sidebar.</li>
						<li>2. The commander with the highest value benefits most from that gift.</li>
						<li>3. After using gifts, update the commander's level if it changed.</li>
					</ol>
				</section>

				<section>
					<h3 class="mb-3 font-display text-xl text-(--color-gold-bright)">What are the 'Weights'?</h3>
					<p class="text-base text-(--color-ash)">
						Weights customize the calculation for determining the best commander per gift.
						For example, if you're unlocking T4s, prioritize Aptitude and Finance.
						For PvP power, prioritize Combat, Leadership, and Command.
					</p>
				</section>
			</div>
		</div>
	</div>
{/if}
