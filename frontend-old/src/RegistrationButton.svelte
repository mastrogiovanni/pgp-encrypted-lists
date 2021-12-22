<script>
    import { generateKey, readMessage, decrypt } from "openpgp";
    import { Button } from "sveltestrap";
    import { download } from "./lib";

    async function register() {
        const keys = await generateKey({
            curve: "ed25519",
            userIDs: [{ name: "Test", email: "test@test.com" }],
        });
        download("credential.json", keys);
    }
</script>

<Button color="primary" on:click={register}>Register</Button>
