<script>
    import Variables from "svelte-atoms/Variables.svelte";
    import DropZone from "svelte-atoms/DropZone.svelte";
    import { identitySchema } from "./libs.ts";

    export let identity;

    export let jwt;

    let fileName = undefined;

    let error = undefined;

    async function getFile(e) {
        const file = e.dataTransfer
            ? e.dataTransfer.files[0]
            : e.target.files[0];
        return new Promise((accept, reject) => {
            var fr = new FileReader();
            fr.onload = function () {
                accept({
                    fileName: file.name,
                    content: fr.result,
                });
            };
            fr.readAsText(file);
        });
    }

    async function login() {
        
    }

    async function onChange(e) {
        identity = undefined;
        jwt = undefined;
        error = undefined;
        try {
            const { fileName, content } = await getFile(e);
            const payload = JSON.parse(content);
            const ajv = new window.ajv7();
            const valid = ajv.validate(identitySchema, payload)
            if (valid) {
                identity = payload;
            }
            else {
                error = "File is not a valid identity file";
                console.log(ajv.errors)
            }
        }
        catch (e) {
            error = "File is not a valid identity file";
            console.log(e);
        }
    }
</script>

<svelte:head>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/ajv/8.1.0/ajv7.bundle.js"
        integrity="sha512-PuzkO+wOBh6m/Jux4nXgl2ItRzed77lFDidDX500DUNlvuzr4OrXtsFhN4q0CCxPoXjTFfiw1z4FmED9J/MMdQ=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"></script>
</svelte:head>

{#if error}
{error}
{/if}

<Variables />

<DropZone
    fileTitle={fileName}
    dropOnPage
    on:drop={onChange}
    on:change={onChange}
/>
