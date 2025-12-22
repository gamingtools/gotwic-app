<script lang="ts">
	import { friendshipStore } from '$lib/stores/friendship.svelte';

	const weightKeys = ['aptitude', 'finance', 'command', 'combat', 'leadership'] as const;

	const weightIcons: Record<string, string> = {
		aptitude: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
		finance: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		command: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		combat: 'M13 10V3L4 14h7v7l9-11h-7z',
		leadership: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
	};

	function handleWeightChange(key: (typeof weightKeys)[number], event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value) || 0;
		friendshipStore.updateWeight(key, value);
	}
</script>

<div class="panel overflow-hidden">
	<div class="panel-header px-4 py-2.5">
		<h3 class="font-display font-bold tracking-wide text-[var(--color-gold)]">Weights</h3>
	</div>
	<div class="divide-y divide-[var(--color-gold)]/10">
		{#each weightKeys as key}
			<div class="table-row-hover flex items-center justify-between px-4 py-2.5">
				<div class="flex items-center gap-2">
					<svg class="h-4 w-4 text-[var(--color-gold)]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={weightIcons[key]} />
					</svg>
					<label class="capitalize text-[var(--color-parchment)]" for="weight-{key}">{key}</label>
				</div>
				<input
					id="weight-{key}"
					type="number"
					min="0"
					max="10"
					value={friendshipStore.weights[key]}
					onchange={(e) => handleWeightChange(key, e)}
					class="input-dark w-14 rounded px-2 py-1 text-center"
				/>
			</div>
		{/each}
	</div>
</div>
