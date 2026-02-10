<script lang="ts">
	import { page } from '$app/state';

	let open = $state(false);

	function currentUrl() {
		return encodeURI(page.url.toString());
	}

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}
</script>

<svelte:window onclick={close} />

<div class="relative">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onclick={(e) => { e.stopPropagation(); toggle(); }}>
		{#if !page.data.session}
			<button
				class="btn-gold flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs lg:text-sm font-display"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
					/>
				</svg>
				<span class="hidden sm:inline">Sign In</span>
			</button>
		{:else}
			<button
				class="btn-gold flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs lg:text-sm font-display"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
				<span class="hidden sm:inline">Account</span>
			</button>
		{/if}
	</div>

	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute right-0 top-full mt-2 min-w-[160px] rounded border border-(--color-gold)/20 bg-(--color-slate) shadow-lg shadow-black/50"
			onclick={(e) => e.stopPropagation()}
		>
			{#if !page.data.session}
				<div class="p-1">
					<a
						href="https://auth.gaming.tools/auth/discord?redirect_to={currentUrl()}"
						class="flex items-center gap-2 rounded px-3 py-2 text-sm text-(--color-parchment) transition-colors hover:bg-(--color-gold)/10"
					>
						<svg class="h-4 w-4 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"
							/>
						</svg>
						Discord
					</a>
					<a
						href="https://auth.gaming.tools/auth/google?redirect_to={currentUrl()}"
						class="flex items-center gap-2 rounded px-3 py-2 text-sm text-(--color-parchment) transition-colors hover:bg-(--color-gold)/10"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Google
					</a>
					<a
						href="https://auth.gaming.tools/auth/patreon?redirect_to={currentUrl()}"
						class="flex items-center gap-2 rounded px-3 py-2 text-sm text-(--color-parchment) transition-colors hover:bg-(--color-gold)/10"
					>
						<svg class="h-4 w-4 text-[#FF424D]" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z"
							/>
						</svg>
						Patreon
					</a>
				</div>
			{:else}
				<div class="p-1">
					<a
						href="https://auth.gaming.tools/auth/logout?redirect_to={currentUrl()}"
						class="flex items-center gap-2 rounded px-3 py-2 text-sm text-(--color-parchment) transition-colors hover:bg-(--color-crimson)/20 hover:text-(--color-crimson)"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						Sign Out
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
