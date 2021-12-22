<script>
	import Identity from "./Identity.svelte";

	let listName;

	let lists = {};

	let identity;

	let currentList;

	let listNames = [];

	function register() {
		lists[listName] = {
			uuid: Object.keys(lists).length,
			privateKey: "private",
			publicKey: "public",
			items: []
		}
	}

	$: listNames = Object.keys(lists);

	$: {
		console.log(identity);
	}
</script>

<h1>Drop here your identity</h1>

<Identity bind:identity={identity}></Identity>

{#if !!identity}

<h1>Register</h1>

<form>
	<input type="text" id="listName" name="listName" bind:value={listName} />
	<button on:click|preventDefault={register} class="btn btn-sm btn-primary">Crea lista</button>
</form>

<h1>Login</h1>

<form>
	<input type="file" id="identity" name="identity" />
</form>

{#if !currentList}
<h1>Lists</h1>
<ul>
{#each listNames as item}
	<li><button on:click|preventDefault={() => { currentList = item }}>{item}</button></li>
{/each}
</ul>
{:else}
<h1>Current Items</h1>
	<ul>
	{#each lists[currentList].items as item}
		<li>{item}</li>
	{/each}
	</ul>
{/if}

{/if}