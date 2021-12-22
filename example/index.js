const { sign, readCleartextMessage, createCleartextMessage, readMessage, decrypt, readPrivateKey, decryptKey } = require('openpgp');

const axios = require("axios");

async function create(name, email, payload) {
    const response = await axios.request({
        url: "http://localhost:3000/pgp/create",
        method: 'post',
        data: {
            name,
            email,
            payload
        }
    })
    return response.data;
}

async function submit(idTemplate, name, email, payload) {
    const response = await axios.request({
        url: "http://localhost:3000/pgp/submit",
        method: 'post',
        data: {
            idTemplate,
            name,
            email,
            payload
        }
    })
    return response.data;
}

async function list(idTemplate) {
    const response = await axios.get(`http://localhost:3000/pgp/list/${idTemplate}`);
    return response.data;
}

async function login(idTemplate, privateKeyArmored) {
    const timestamp = Date.now();

    const privateKey = await decryptKey({
        privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: '-'
    });

    const unsignedMessage = await createCleartextMessage({ text: "" + timestamp });

    const cleartextMessage = await sign({
        message: unsignedMessage, // CleartextMessage or Message object
        signingKeys: privateKey
    });

    const response = await axios.request({
        url: "http://localhost:3000/pgp/login",
        method: 'post',
        data: {
            idTemplate,
            timestamp,
            signedTimestamp: cleartextMessage.toString()
        }
    })
    return response.data;
}

async function bootstrap() {

    try {

        const created = await create("Michele Mastrogiovanni", "michele.mastrogiovanni@gmail.com", {});

        console.log(await login(created._id, created.privateKey));

        let submissions = {}
        for (let i = 0; i < 3; i++) {
            const submission = await submit(
                created._id,
                "pippo" + i,
                i + "pluto@pippo.com",
                {
                    option1: true,
                    option2: false,
                    option3: true
                }
            );
            // this.score(submission.id, i);
            submissions[i] = submission;
        }

        const results = await list(created._id);

        // Decrypt with first private key
        await decryptList(results, submissions[0].privateKey);

        // Dump all data
        results.forEach(x => { console.log("* " + JSON.stringify(x, null, 2)) });

        /*
        const created = await this.create({  });
    
        console.log("Encrypted list")
        await this.decryptList(
            results, 
            submissions[0].privateKey
        )
    
        results.forEach(item => { console.log("* ", item )});
    
        console.log("Plain list")
        console.log(await this.listPlain(created.id))
        // console.log(await this.listPlain(created.id))
        */

    }
    catch (e) {
        console.log(e);
    }
}

async function decryptList(payloads, privateKeyArmored) {
    for (let payload of payloads) {
        try {
            if (payload.encrypted) {
                const message = await readMessage({
                    armoredMessage: payload.encrypted // parse armored message
                });
                const privateKey = await decryptKey({
                    privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
                    passphrase: '-'
                });
                const decrypted = await decrypt({
                    message,
                    decryptionKeys: privateKey
                });
                payload.plain = JSON.parse(decrypted.data)
            }
        }
        catch (e) {
            // console.log(e);
        }
    }
}

bootstrap();
