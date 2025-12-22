<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import CommanderTable from '$lib/components/CommanderTable.svelte';
	import WeightsPanel from '$lib/components/WeightsPanel.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import GiftPriorityPanel from '$lib/components/GiftPriorityPanel.svelte';
	import { GIFT_TYPES } from '$lib/types';
</script>

<svelte:head>
	<title>GoTWiC - Friendship Calculator - Game of Thrones Winter is Coming</title>
	<meta name="description" content="Optimize gift distribution to commanders in Game of Thrones: Winter is Coming" />
	<meta name="robots" content="index, follow" />

	<!-- Schema.org -->
	<meta itemprop="name" content="GoTWiC - Friendship Calculator - Game of Thrones Winter is Coming" />
	<meta itemprop="description" content="Optimize gift distribution to commanders in Game of Thrones: Winter is Coming" />
	<meta itemprop="image" content="https://gtcdn.info/gt/logo.png" />

	<!-- Open Graph -->
	<meta property="og:site_name" content="gaming.tools" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="GoTWiC - Friendship Calculator - Game of Thrones Winter is Coming" />
	<meta property="og:description" content="Optimize gift distribution to commanders in Game of Thrones: Winter is Coming" />
	<meta property="og:url" content="https://gaming.tools/gotwic/friendship" />
	<meta property="og:locale" content="en" />
	<meta property="og:image" content="https://gtcdn.info/gt/logo.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@gamingtoolsx" />
	<meta name="twitter:title" content="GoTWiC - Friendship Calculator - Game of Thrones Winter is Coming" />
	<meta name="twitter:description" content="Optimize gift distribution to commanders in Game of Thrones: Winter is Coming" />
	<meta name="twitter:image" content="https://gtcdn.info/gt/logo.png" />
	<meta name="twitter:creator" content="@gamingtoolsx" />
	<meta name="twitter:domain" content="gaming.tools" />
	<meta name="twitter:url" content="https://gaming.tools/gotwic/friendship" />

	<link rel="canonical" href="https://gaming.tools/gotwic/friendship" />
</svelte:head>

<div class="min-h-screen">
	<Header />

	<main class="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
		<!-- Desktop: Side by side layout, Mobile: Stack -->
		<div class="flex flex-col gap-6 lg:flex-row">
			<!-- Left side: Commander table -->
			<div class="min-w-0 flex-1 lg:order-1">
				<CommanderTable />
			</div>

			<!-- Right side: Sidebar panels -->
			<div class="w-full space-y-4 lg:order-2 lg:w-80 lg:shrink-0">
				<!-- Weights and Settings in a row on tablet -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
					<WeightsPanel />
					<SettingsPanel />
				</div>

				<!-- Decorative divider -->
				<div class="flex items-center gap-4 py-2">
					<div class="h-px flex-1 bg-gradient-to-r from-transparent via-(--color-gold)/30 to-transparent"></div>
					<span class="font-display tracking-[0.2em] text-(--color-gold)/60">GIFT PRIORITIES</span>
					<div class="h-px flex-1 bg-gradient-to-r from-transparent via-(--color-gold)/30 to-transparent"></div>
				</div>

				<!-- Gift Priority Panels -->
				<div class="grid grid-cols-1 gap-3">
					{#each GIFT_TYPES as giftType, i}
						<div class="animate-fade-in" style="animation-delay: {i * 50}ms">
							<GiftPriorityPanel {giftType} />
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<footer class="mt-12 border-t border-(--color-gold)/10 pt-6">
			<div class="flex flex-col items-center gap-2 text-center">
				<div class="flex items-center gap-3">
					<div class="h-px w-12 bg-gradient-to-r from-transparent to-(--color-gold)/30"></div>
					<svg class="h-5 w-5 text-(--color-gold)/40" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
					</svg>
					<div class="h-px w-12 bg-gradient-to-l from-transparent to-(--color-gold)/30"></div>
				</div>
				<p class="text-sm text-(--color-ash)">Created by Adain Rivers of RYS from K21</p>
				<p class="text-xs text-(--color-steel)">Many thanks to all contributors for their valuable support and feedback.</p>
			</div>
		</footer>
	</main>
</div>
