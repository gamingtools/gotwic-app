<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';
	import SaveIndicator from '$lib/components/SaveIndicator.svelte';
	import Topbar from '$lib/components/Topbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Topbar />
{@render children()}
<Toast />
<SaveIndicator />
