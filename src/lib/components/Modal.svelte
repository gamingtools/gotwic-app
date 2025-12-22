<script lang="ts">
	interface Props {
		open: boolean;
		title: string;
		confirmText?: string;
		cancelText?: string;
		confirmDanger?: boolean;
		onconfirm: () => void;
		oncancel: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		open,
		title,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		confirmDanger = false,
		onconfirm,
		oncancel,
		children
	}: Props = $props();

	// Disable body scroll when modal is open
	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			oncancel();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			oncancel();
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-(--color-void)/80 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="panel animate-fade-in w-full max-w-md p-5">
			<h2 class="mb-4 font-display text-lg text-(--color-gold)">{title}</h2>

			<div class="mb-6 text-(--color-parchment)">
				{#if children}
					{@render children()}
				{/if}
			</div>

			<div class="flex justify-end gap-3">
				<button
					onclick={oncancel}
					class="rounded border border-(--color-steel) bg-(--color-slate) px-4 py-2 text-sm text-(--color-ash) transition-all hover:border-(--color-gold)/30 hover:text-(--color-parchment)"
				>
					{cancelText}
				</button>
				<button
					onclick={onconfirm}
					class="rounded px-4 py-2 text-sm transition-all {confirmDanger
						? 'border border-(--color-crimson)/50 bg-(--color-crimson)/20 text-(--color-crimson) hover:bg-(--color-crimson)/30'
						: 'btn-gold'}"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
