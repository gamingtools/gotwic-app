<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';

	let fileInput: HTMLInputElement;

	function handleProfileChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		friendshipStore.changeProfile(target.value);
	}

	function askProfile() {
		const name = window.prompt('Enter new profile name (only letters and numbers are allowed)');
		if (name) {
			friendshipStore.addProfile(name);
		}
	}

	function deleteProfile() {
		if (confirm('Are you sure you want to permanently delete this profile?')) {
			friendshipStore.deleteProfile();
		}
	}

	function exportData() {
		const data = friendshipStore.exportProfile();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${friendshipStore.currentProfileId}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function importData() {
		fileInput?.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const fileName = file.name.replace('.json', '');
		if (friendshipStore.currentProfileId !== fileName) {
			if (friendshipStore.profiles.includes(fileName)) {
				friendshipStore.changeProfile(fileName);
			} else {
				friendshipStore.addProfile(fileName);
			}
		}

		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			if (!friendshipStore.importProfile(result)) {
				alert('Failed to import the data.');
			}
		};
		reader.readAsText(file);
		target.value = '';
	}

	function resetData() {
		if (confirm('This will reset all the data. Are you sure?')) {
			friendshipStore.resetProfile();
		}
	}

	let showGuide = $state(false);
</script>

<!-- Header Bar -->
<header class="sticky top-0 z-40 border-b border-[var(--color-gold)]/20 bg-[var(--color-obsidian)]/95 backdrop-blur-sm">
	<!-- Top decorative line -->
	<div class="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent"></div>

	<div class="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6">
		<!-- Title -->
		<div class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10">
				<svg class="h-5 w-5 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
				</svg>
			</div>
			<h1 class="font-got text-lg lg:text-xl tracking-wide text-[var(--color-gold)]">Friendship Calculator</h1>
		</div>

		<!-- Profile Selection -->
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex items-center gap-2 rounded border border-[var(--color-gold)]/20 bg-[var(--color-void)]/50 px-2 py-1">
				<svg class="h-4 w-4 text-[var(--color-ash)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				<select
					class="cursor-pointer border-none bg-transparent pr-6 text-xs lg:text-sm text-[var(--color-parchment)] focus:outline-none"
					onchange={handleProfileChange}
					value={friendshipStore.currentProfileId}
				>
					{#each friendshipStore.profiles as profile}
						<option value={profile} class="bg-[var(--color-slate)] text-[var(--color-parchment)]">{profile}</option>
					{/each}
				</select>
			</div>

			<button
				onclick={askProfile}
				class="btn-gold flex items-center gap-1.5 rounded px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span class="hidden sm:inline">Add</span>
			</button>

			{#if friendshipStore.profiles.length > 1}
				<button
					onclick={deleteProfile}
					class="flex items-center gap-1.5 rounded border border-[var(--color-crimson)]/30 bg-[var(--color-crimson)]/10 px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm text-[var(--color-crimson)] transition-all hover:border-[var(--color-crimson)]/50 hover:bg-[var(--color-crimson)]/20"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
					</svg>
					<span class="hidden sm:inline">Delete</span>
				</button>
			{/if}
		</div>

		<!-- Data Actions -->
		<div class="flex flex-wrap items-center gap-2">
			<button onclick={exportData} class="btn-gold flex items-center gap-1.5 rounded px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
				</svg>
				<span class="hidden sm:inline">Export</span>
			</button>

			<button onclick={importData} class="btn-gold flex items-center gap-1.5 rounded px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
				</svg>
				<span class="hidden sm:inline">Import</span>
			</button>

			<input bind:this={fileInput} type="file" accept=".json" class="hidden" onchange={handleFileChange} />

			<button onclick={resetData} class="btn-gold flex items-center gap-1.5 rounded px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
				<span class="hidden sm:inline">Reset</span>
			</button>

			<div class="mx-1 hidden h-6 w-px bg-[var(--color-steel)]/50 sm:block"></div>

			<a
				href="https://gaming.tools/discord"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1.5 rounded border border-[var(--color-steel)] bg-[var(--color-slate)] px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm text-[var(--color-ash)] transition-all hover:border-[#5865F2]/50 hover:text-[#5865F2]"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
					<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
				</svg>
				<span class="hidden sm:inline">Discord</span>
			</a>

			<button
				onclick={() => (showGuide = true)}
				class="flex items-center gap-1.5 rounded border border-[var(--color-steel)] bg-[var(--color-slate)] px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm text-[var(--color-ash)] transition-all hover:border-[var(--color-gold)]/30 hover:text-[var(--color-parchment)]"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span class="hidden sm:inline">Guide</span>
			</button>
		</div>
	</div>

	<!-- Bottom decorative line -->
	<div class="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent"></div>
</header>

<!-- Guide Modal -->
{#if showGuide}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-void)]/80 p-4 backdrop-blur-sm"
		onclick={(e) => e.target === e.currentTarget && (showGuide = false)}
		onkeydown={(e) => e.key === 'Escape' && (showGuide = false)}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="panel animate-fade-in max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
			<!-- Header -->
			<div class="mb-6 flex items-start justify-between">
				<div>
					<h2 class="font-got text-2xl text-[var(--color-gold)]">Tavern Friendship Calculator</h2>
					<p class="mt-1 text-sm text-[var(--color-ash)]">for Game of Thrones - Winter is Coming Browser Game</p>
				</div>
				<button
					onclick={() => (showGuide = false)}
					aria-label="Close guide"
					class="flex h-8 w-8 items-center justify-center rounded border border-[var(--color-steel)] text-[var(--color-ash)] transition-colors hover:border-[var(--color-crimson)] hover:text-[var(--color-crimson)]"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="space-y-6 text-[var(--color-parchment)]">
				<section>
					<h3 class="mb-2 font-display text-lg text-[var(--color-gold-bright)]">What is it for?</h3>
					<ul class="space-y-1 text-sm text-[var(--color-ash)]">
						<li class="flex items-start gap-2">
							<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]"></span>
							To perfectly distribute gifts to commanders for max benefit.
						</li>
						<li class="flex items-start gap-2">
							<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]"></span>
							To help decide which commander to upgrade / unlock next.
						</li>
					</ul>
				</section>

				<section>
					<h3 class="mb-3 font-display text-lg text-[var(--color-gold-bright)]">How to use?</h3>

					<h4 class="mb-2 text-sm font-semibold text-[var(--color-parchment)]">First time setup</h4>
					<ol class="mb-4 space-y-2 text-sm text-[var(--color-ash)]">
						<li>
							<span class="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold)]/20 text-xs text-[var(--color-gold)]">1</span>
							If you have more than one account, create a profile for each by clicking 'Add'.
						</li>
						<li>
							<span class="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold)]/20 text-xs text-[var(--color-gold)]">2</span>
							Select Quality for each commander you have unlocked in the game.
						</li>
						<li>
							<span class="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold)]/20 text-xs text-[var(--color-gold)]">3</span>
							Enter the Friendship Level for each commander.
						</li>
						<li>
							<span class="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold)]/20 text-xs text-[var(--color-gold)]">4</span>
							Set the Weights based on your priorities.
						</li>
					</ol>

					<h4 class="mb-2 text-sm font-semibold text-[var(--color-parchment)]">Everyday use</h4>
					<ol class="space-y-1 text-sm text-[var(--color-ash)]">
						<li>1. Find the gift section matching your gift type on the sidebar.</li>
						<li>2. The commander with the highest value benefits most from that gift.</li>
						<li>3. After using gifts, update the commander's level if it changed.</li>
					</ol>
				</section>

				<section>
					<h3 class="mb-2 font-display text-lg text-[var(--color-gold-bright)]">What are the 'Weights'?</h3>
					<p class="text-sm text-[var(--color-ash)]">
						Weights customize the calculation for determining the best commander per gift.
						For example, if you're unlocking T4s, prioritize Aptitude and Finance.
						For PvP power, prioritize Combat, Leadership, and Command.
					</p>
				</section>
			</div>
		</div>
	</div>
{/if}
