type ToastType = 'success' | 'error' | 'info';

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

function createToastStore() {
	let toasts = $state<Toast[]>([]);
	let nextId = 0;

	function show(message: string, type: ToastType = 'info', duration = 3000) {
		const id = nextId++;
		toasts = [...toasts, { id, message, type }];

		setTimeout(() => {
			dismiss(id);
		}, duration);
	}

	function dismiss(id: number) {
		toasts = toasts.filter((t) => t.id !== id);
	}

	return {
		get toasts() {
			return toasts;
		},
		success: (message: string) => show(message, 'success'),
		error: (message: string) => show(message, 'error', 5000),
		info: (message: string) => show(message, 'info'),
		dismiss
	};
}

export const toastStore = createToastStore();
