<script>
	import { Form, FormGroup, FormText, Input, Label } from "sveltestrap";
	import { Col, Container, Row } from "sveltestrap";

	import { generateKey, readMessage, decrypt } from 'openpgp';

	console.log(readMessage, decrypt );

	import { onMount } from "svelte";

	import { Button, Modal } from "sveltestrap";

	let isOpen = false;
	const toggle = () => (isOpen = !isOpen);

	async function getList() {
		const response = await fetch("http://localhost:3000/find");
		return await response.json();
	}

	async function getFile() {
		return new Promise((accept, reject) => {
			if (files && files.length > 0) {
				var fr = new FileReader();
				fr.onload = function () {
					accept(fr.result);
				};
				fr.readAsText(files[0]);
			}
		});
	}

	async function login(e) {
		e.preventDefault();
		if (files && files.length > 0) {
			var fr = new FileReader();
			fr.onload = function () {
				console.log(fr.result);
			};
			fr.readAsText(files[0]);
			// console.log(JSON.parse(files[0]))
		}
	}

	let name = undefined;

	async function pippo() {
		const content = await getFile();
		const body = JSON.parse(content.toString());
		console.log(body);
	}

	async function submit() {
		const content = await getFile();
		const body = JSON.parse(content.toString());
		console.log(body);

		await fetch("http://localhost:3000/submit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				uuid: body.uuid,
				name,
			}),
		});
	}

	let list = [];

	let files;

	let currentIdentity = {};

	onMount(async () => {
		list = await getList();
	});
</script>

<main>
	<h2>Hello {name}!</h2>

	<Container>
			<Row>
				<Col>
					
				</Col>
			</Row>
			<Row>
				<Col>
					<Form>
						<FormGroup>
							<Label for="exampleFile">File</Label>
							<Input type="file" bind:files />
							<!--
							<FormText color="muted">
								This is some placeholder block-level help text for the above input.
								It's a bit lighter and easily wraps to a new line.
							</FormText>
						-->
						</FormGroup>
						<Button color="primary" on:click={login}>Login</Button>
					</Form>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form>
						<FormGroup>
							<Label for="name">Name</Label>
							<Input type="text" id="name" bind:value={name} />
						</FormGroup>
					</Form>
					<Button color="primary" on:click={submit}>Submit</Button>
				</Col>
			</Row>
		</Container>

</main>

<Button color="primary" on:click={pippo}>Pippo</Button>



<!--
<Button color="primary" on:click={toggle}>Hello World!</Button>

<Modal body {isOpen} {toggle} header="Hello World!">
	<p>There's a song that we're singing. Come on</p>
	<img
		src="https://i.ytimg.com/vi/NUJIRujygvY/hqdefault.jpg"
		alt="Come on Get Happy"
		class="img-fluid"
	/>
</Modal>
-->

<Container>
	{#each list as item}
		<Row>
			<Col>{item.uuid}</Col>
			<Col>{item.data}</Col>
		</Row>
	{/each}
</Container>

<style>
	/*
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	*/
</style>
