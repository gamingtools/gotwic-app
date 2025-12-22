<script lang="ts">
	interface Props {
		open: boolean;
		title: string;
		placeholder?: string;
		confirmText?: string;
		cancelText?: string;
		onconfirm: (value: string) => void;
		oncancel: () => void;
	}

	let {
		open,
		title,
		placeholder = '',
		confirmText = 'OK',
		cancelText = 'Cancel',
		onconfirm,
		oncancel
	}: Props = $props();

	let inputValue = $state('');
	let inputElement: HTMLInputElement | undefined = $state();

	// Reset and focus input when modal opens
	$effect(() => {
		if (open) {
			inputValue = '';
			document.body.style.overflow = 'hidden';
			// Focus input after a brief delay to ensure it's rendered
			setTimeout(() => inputElement?.focus(), 50);
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	function handleSubmit() {
		if (inputValue.trim()) {
			onconfirm(inputValue.trim());
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			oncancel();
		} else if (e.key === 'Enter') {
			handleSubmit();
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
		class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-void)]/80 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="panel animate-fade-in w-full max-w-md p-5">
			<h2 class="mb-4 font-display text-lg text-[var(--color-gold)]">{title}</h2>

			<div class="mb-6">
				<input
					bind:this={inputElement}
					bind:value={inputValue}
					type="text"
					{placeholder}
					class="w-full rounded border border-[var(--color-gold)]/20 bg-[var(--color-void)]/60 px-3 py-2 text-[var(--color-parchment)] placeholder-[var(--color-ash)]/60 transition-colors focus:border-[var(--color-gold)]/50 focus:outline-none"
				/>
			</div>

			<div class="flex justify-end gap-3">
				<button
					onclick={oncancel}
					class="rounded border border-[var(--color-steel)] bg-[var(--color-slate)] px-4 py-2 text-sm text-[var(--color-ash)] transition-all hover:border-[var(--color-gold)]/30 hover:text-[var(--color-parchment)]"
				>
					{cancelText}
				</button>
				<button
					onclick={handleSubmit}
					disabled={!inputValue.trim()}
					class="btn-gold rounded px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
