<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';

	const iconPaths: Record<string, string> = {
		success: 'M5 13l4 4L19 7',
		error: 'M6 18L18 6M6 6l12 12',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
	};

	const bgColors: Record<string, string> = {
		success: 'bg-green-900/90 border-green-700/50',
		error: 'bg-red-900/90 border-red-700/50',
		info: 'bg-[var(--color-slate)]/95 border-[var(--color-gold)]/30'
	};

	const iconColors: Record<string, string> = {
		success: 'text-green-400',
		error: 'text-red-400',
		info: 'text-[var(--color-gold)]'
	};
</script>

{#if toastStore.toasts.length > 0}
	<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
		{#each toastStore.toasts as toast (toast.id)}
			<div
				class="animate-fade-in flex items-center gap-3 rounded border px-4 py-3 shadow-lg backdrop-blur-sm {bgColors[toast.type]}"
				role="alert"
			>
				<svg class="h-5 w-5 shrink-0 {iconColors[toast.type]}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPaths[toast.type]} />
				</svg>
				<span class="text-sm text-[var(--color-parchment)]">{toast.message}</span>
				<button
					onclick={() => toastStore.dismiss(toast.id)}
					class="ml-2 text-[var(--color-ash)] hover:text-[var(--color-parchment)]"
					aria-label="Dismiss"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}
