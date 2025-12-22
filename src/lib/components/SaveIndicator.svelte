<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';

	let visible = $state(false);
	let lastKnownSave = $state(0);

	$effect(() => {
		const currentSave = friendshipStore.lastSaved;
		if (currentSave > 0 && currentSave !== lastKnownSave) {
			lastKnownSave = currentSave;
			visible = true;
			setTimeout(() => {
				visible = false;
			}, 1500);
		}
	});
</script>

{#if visible}
	<div class="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded border border-(--color-gold)/30 bg-(--color-slate)/95 px-3 py-1.5 text-xs text-(--color-gold) shadow-lg backdrop-blur-sm animate-fade-in">
		<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
		</svg>
		<span>Saved</span>
	</div>
{/if}
