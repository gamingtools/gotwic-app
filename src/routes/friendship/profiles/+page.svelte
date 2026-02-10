<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import PromptModal from '$lib/components/PromptModal.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import SigninDropdown from '$lib/components/auth/SigninDropdown.svelte';

	let fileInput: HTMLInputElement;
	let resetBackup: string | null = $state(null);

	// Modal states
	let showAddProfileModal = $state(false);
	let showDeleteProfileModal = $state(false);
	let showResetModal = $state(false);

	// Initialize cloud storage when user is signed in
	$effect(() => {
		if (page.data.session?.user?.id) {
			friendshipStore.initCloud();
		}
	});

	function askProfile() {
		showAddProfileModal = true;
	}

	function handleAddProfile(name: string) {
		showAddProfileModal = false;
		if (friendshipStore.addProfile(name)) {
			toastStore.success(`Profile "${name}" created`);
		} else {
			toastStore.error('Invalid or duplicate profile name');
		}
	}

	function deleteProfile() {
		showDeleteProfileModal = true;
	}

	function confirmDeleteProfile() {
		showDeleteProfileModal = false;
		const name = friendshipStore.currentProfileId;
		friendshipStore.deleteProfile();
		toastStore.success(`Profile "${name}" deleted`);
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
		toastStore.success('Profile exported');
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
			if (friendshipStore.importProfile(result)) {
				toastStore.success('Profile imported successfully');
			} else {
				toastStore.error('Failed to import profile data');
			}
		};
		reader.readAsText(file);
		target.value = '';
	}

	function resetData() {
		showResetModal = true;
	}

	function confirmResetData() {
		showResetModal = false;
		resetBackup = friendshipStore.exportProfile();
		friendshipStore.resetProfile();
		toastStore.info('Profile reset. Click here to undo.');

		setTimeout(() => {
			resetBackup = null;
		}, 10000);
	}

	function undoReset() {
		if (resetBackup) {
			friendshipStore.importProfile(resetBackup);
			resetBackup = null;
			toastStore.success('Reset undone');
		}
	}

</script>

<svelte:head>
	<title>GoTWiC - Profile Management</title>
</svelte:head>

<div class="min-h-screen">
	<!-- Header Bar -->
	<header class="sticky top-0 z-40 border-b border-(--color-gold)/20 bg-(--color-obsidian)/95 backdrop-blur-sm">
		<div class="h-px bg-gradient-to-r from-transparent via-(--color-gold)/40 to-transparent"></div>

		<div class="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
			<!-- Left: Back + Title -->
			<div class="flex items-center gap-3">
				<a
					href="{base}/friendship"
					class="flex items-center gap-2 text-(--color-ash) transition-colors hover:text-(--color-gold)"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					<span class="text-sm">Back</span>
				</a>

				<div class="h-5 w-px bg-(--color-steel)/40"></div>

				<div class="flex items-center gap-2">
					<div class="flex h-8 w-8 items-center justify-center rounded border border-(--color-gold)/30 bg-(--color-gold)/10">
						<svg class="h-4 w-4 text-(--color-gold)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<h1 class="font-got text-base lg:text-lg tracking-wide text-(--color-gold)">Profile Management</h1>
				</div>
			</div>

			<!-- Right: Sign in -->
			<SigninDropdown />
		</div>

		<div class="h-px bg-gradient-to-r from-transparent via-(--color-gold)/20 to-transparent"></div>
	</header>

	<main class="mx-auto max-w-3xl px-4 py-8 lg:px-6">
		<!-- Current Profile -->
		<section class="panel mb-6 p-5">
			<h2 class="mb-4 font-display text-lg text-(--color-gold)">Current Profile</h2>
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-2 rounded border border-(--color-gold)/20 bg-(--color-void)/50 px-3 py-2">
					<svg class="h-4 w-4 text-(--color-ash)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					<span class="text-sm text-(--color-parchment)">{friendshipStore.currentProfileId}</span>
				</div>
				{#if friendshipStore.cloudMode}
					<div class="flex items-center gap-1.5 rounded bg-(--color-gold)/10 px-2 py-1">
						<svg class="h-3.5 w-3.5 text-(--color-gold)/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
						</svg>
						<span class="text-xs text-(--color-gold)/70">Cloud synced</span>
					</div>
				{:else}
					<div class="flex items-center gap-1.5 rounded bg-(--color-steel)/10 px-2 py-1">
						<svg class="h-3.5 w-3.5 text-(--color-ash)/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
						</svg>
						<span class="text-xs text-(--color-ash)/50">Local only</span>
					</div>
				{/if}
			</div>
		</section>

		<!-- Profiles List -->
		<section class="panel mb-6 p-5">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<h2 class="font-display text-lg text-(--color-gold)">Profiles</h2>
					{#if friendshipStore.cloudMode}
						<svg class="h-4 w-4 text-(--color-gold)/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Cloud synced">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
						</svg>
					{/if}
				</div>
				<button
					onclick={askProfile}
					class="btn-gold flex items-center gap-1.5 rounded px-3 py-1.5 text-sm"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					Add Profile
				</button>
			</div>

			<div class="space-y-2">
				{#each friendshipStore.profiles as profile (profile)}
					<div
						class="flex items-center justify-between rounded border px-4 py-3 transition-all {profile === friendshipStore.currentProfileId
							? 'border-(--color-gold)/40 bg-(--color-gold)/5'
							: 'border-(--color-steel)/30 bg-(--color-void)/30 hover:border-(--color-steel)/50'}"
					>
						<div class="flex items-center gap-3">
							{#if profile === friendshipStore.currentProfileId}
								<div class="h-2 w-2 rounded-full bg-(--color-gold)"></div>
							{:else}
								<div class="h-2 w-2 rounded-full bg-(--color-steel)/40"></div>
							{/if}
							<span class="text-sm text-(--color-parchment)">{profile}</span>
							{#if profile === friendshipStore.currentProfileId}
								<span class="rounded bg-(--color-gold)/15 px-2 py-0.5 text-xs text-(--color-gold)">active</span>
							{/if}
						</div>

						<div class="flex items-center gap-2">
							{#if profile !== friendshipStore.currentProfileId}
								<button
									onclick={() => {
										friendshipStore.changeProfile(profile);
										toastStore.info(`Switched to ${profile}`);
									}}
									class="rounded border border-(--color-steel) bg-(--color-slate) px-3 py-1 text-xs text-(--color-ash) transition-all hover:border-(--color-gold)/30 hover:text-(--color-parchment)"
								>
									Switch
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			{#if friendshipStore.profiles.length > 1}
				<div class="mt-4 border-t border-(--color-steel)/20 pt-4">
					<button
						onclick={deleteProfile}
						class="flex items-center gap-1.5 rounded border border-(--color-crimson)/30 bg-(--color-crimson)/10 px-3 py-1.5 text-sm text-(--color-crimson) transition-all hover:border-(--color-crimson)/50 hover:bg-(--color-crimson)/20"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
						</svg>
						Delete Current Profile
					</button>
				</div>
			{/if}
		</section>

		<!-- Data Actions -->
		<section class="panel mb-6 p-5">
			<h2 class="mb-4 font-display text-lg text-(--color-gold)">Data Management</h2>

			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<button onclick={exportData} class="btn-gold flex items-center gap-2 rounded px-4 py-2.5 text-sm">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
					Export Profile
				</button>

				<button onclick={importData} class="btn-gold flex items-center gap-2 rounded px-4 py-2.5 text-sm">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
					</svg>
					Import Profile
				</button>

				<input bind:this={fileInput} type="file" accept=".json" class="hidden" onchange={handleFileChange} />

				<button onclick={resetData} class="flex items-center gap-2 rounded border border-(--color-crimson)/30 bg-(--color-crimson)/10 px-4 py-2.5 text-sm text-(--color-crimson) transition-all hover:border-(--color-crimson)/50 hover:bg-(--color-crimson)/20">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Reset Profile Data
				</button>

				{#if resetBackup}
					<button
						onclick={undoReset}
						class="flex items-center gap-2 rounded border border-(--color-gold) bg-(--color-gold)/20 px-4 py-2.5 text-sm text-(--color-gold) transition-all hover:bg-(--color-gold)/30 animate-pulse"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
						</svg>
						Undo Reset
					</button>
				{/if}
			</div>
		</section>

	</main>
</div>

<!-- Add Profile Modal -->
<PromptModal
	open={showAddProfileModal}
	title="Add New Profile"
	placeholder="Enter profile name (letters and numbers only)"
	confirmText="Create"
	onconfirm={handleAddProfile}
	oncancel={() => (showAddProfileModal = false)}
/>

<!-- Delete Profile Modal -->
<Modal
	open={showDeleteProfileModal}
	title="Delete Profile"
	confirmText="Delete"
	confirmDanger={true}
	onconfirm={confirmDeleteProfile}
	oncancel={() => (showDeleteProfileModal = false)}
>
	Are you sure you want to permanently delete the profile "{friendshipStore.currentProfileId}"?
</Modal>

<!-- Reset Data Modal -->
<Modal
	open={showResetModal}
	title="Reset Profile Data"
	confirmText="Reset"
	confirmDanger={true}
	onconfirm={confirmResetData}
	oncancel={() => (showResetModal = false)}
>
	This will reset all commander data for the current profile. Are you sure?
</Modal>
