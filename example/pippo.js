const openpgp = require('openpgp');

(async () => {

    const passphrase = `yourPassphrase`; // what the private key is encrypted with

    const keys = await openpgp.generateKey({ 
        curve: 'ed25519', 
        userIDs: [{ name: "name", email: "michele@gmail.com" }],
        passphrase
    });

    console.log("Keys", keys)

    const publicKeyArmored = keys.publicKey;
    const privateKeyArmored = keys.privateKey;

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });

    const unsignedMessage = await openpgp.createCleartextMessage({ text: 'Hello, World!' });
    const cleartextMessage = await openpgp.sign({
        message: unsignedMessage, // CleartextMessage or Message object
        signingKeys: privateKey
    });
    console.log(cleartextMessage); // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'

    const signedMessage = await openpgp.readCleartextMessage({
        cleartextMessage // parse armored message
    });
    const verificationResult = await openpgp.verify({
        message: signedMessage,
        verificationKeys: publicKey
    });
    const { verified, keyID } = verificationResult.signatures[0];
    try {
        await verified; // throws on invalid signature
        console.log('Signed by key id ' + keyID.toHex());
    } catch (e) {
        throw new Error('Signature could not be verified: ' + e.message);
    }

    
})();