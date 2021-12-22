import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { readCleartextMessage, verify, readMessage, generateKey, createMessage, encrypt, decrypt, readKey, readPrivateKey, decryptKey } from 'openpgp';
import { CreateTemplateDto } from './dto/create.template.dto';
import { SubmissionDto } from './dto/submission.dto';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { Template, TemplateDocument } from './schemas/template.schema';
import * as mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';
var jwt = require('jsonwebtoken');

const openpgp = require('openpgp');

const PASSPHRASE = "-";
const JWT_TOKEN_SECRET = "stocazzo e tutt'uno";

@Injectable()
export class PgpService {

    constructor(
        @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
        @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>
    ) {
    }

    async clear() {
        await this.submissionModel.deleteMany({})
        await this.templateModel.deleteMany({})
    }

    async create(createTemplate: CreateTemplateDto) {
        const keys = await generateKey({
            curve: 'ed25519',
            userIDs: [{ name: createTemplate.name, email: createTemplate.email }],
            passphrase: PASSPHRASE
        });
        const payload = {
            name: createTemplate.name,
            email: createTemplate.email,
            privateKey: keys.privateKey,
            publicKey: keys.publicKey,
            revocationCertificate: keys.revocationCertificate,
        };
        return await new this.templateModel(payload).save();
    }

    async submit(submissionDto: SubmissionDto) {
        const template = await this.templateModel.findById(submissionDto.idTemplate);
        const keys = await generateKey({
            curve: 'ed25519',
            userIDs: [{ name: submissionDto.name, email: submissionDto.email }],
            passphrase: PASSPHRASE
        });
        const encryptedPayload = await this.encrypt(submissionDto.payload, template.publicKey);
        const submission = await new this.submissionModel({
            template: new mongoose.Types.ObjectId(submissionDto.idTemplate),
            name: submissionDto.name,
            email: submissionDto.email,
            publicKey: keys.publicKey,
            payload: encryptedPayload
        }).save();
        return {
            id: submission._id,
            ...keys
        }
    }

    async login(loginDto: LoginDto) {
        if ((Date.now() - loginDto.timestamp) > 1000) {
            throw new Error("Expired timestamp");
        }

        const template = await this.templateModel.findById(loginDto.idTemplate);

        const signedMessage = await readCleartextMessage({
            cleartextMessage: loginDto.signedTimestamp
        });

        const publicKey = await readKey({ armoredKey: template.publicKey });
        
        const verificationResult = await openpgp.verify({
            message: signedMessage,
            verificationKeys: publicKey
        });

        const { verified, keyID } = verificationResult.signatures[0];
        try {
            await verified; // throws on invalid signature
            // console.log('Signed by key id ' + keyID.toHex());
        } catch (e) {
            throw new Error('Signature could not be verified: ' + e.message);
        }

        return jwt.sign({
            data: {
                idTemplate: loginDto.idTemplate
            },
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }, JWT_TOKEN_SECRET);
    }


    async setScore(idSubmission: string, score: number) {
        const submission = await this.submissionModel.findById(idSubmission);
        submission.score = score;
        return submission.save();
    }

    /**
     * Decrypt payload's submissions internally and encrypt with single public keys
     * 
     * @param idTemplate 
     * @returns 
     */
    async list(idTemplate: string) {
        const self = this;
        const template = await this.templateModel.findById(idTemplate);
        const items = await this.submissionModel.find({
            template: new mongoose.Types.ObjectId(idTemplate)
        })
        let results = [];
        for (let item of items) {
            const decrypted = await this.decrypt(item.payload, template.privateKey);
            const encrypted = await this.encrypt(decrypted, item.publicKey);
            results.push({
                submissionId: item._id.toString(),
                score: item.score,
                encrypted
            });
        }
        return results;
    }

    async listPlain(idTemplate: string) {
        const self = this;
        const template = await this.templateModel.findById(idTemplate);
        const items = await this.submissionModel.find({
            template: new mongoose.Types.ObjectId(idTemplate)
        })
        let results = [];
        for (let item of items) {
            const decrypted = await this.decrypt(item.payload, template.privateKey);
            results.push({
                submissionId: item._id.toString(),
                score: item.score,
                plain: decrypted,
            });
        }
        return results;
    }

    private async decrypt(payload: string, privateKeyArmored: string) {
        const message = await readMessage({
            armoredMessage: payload // parse armored message
        });
        const privateKey = await decryptKey({
            privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
            passphrase: PASSPHRASE
        });
        const decrypted = await decrypt({
            message,
            decryptionKeys: privateKey
        });
        return JSON.parse(decrypted.data);
    }

    private async encrypt(payload: any, publicKey: string) {
        return await encrypt({
            message: await createMessage({ text: JSON.stringify(payload) }),
            encryptionKeys: await readKey({ armoredKey: publicKey })
        })
    }

}
