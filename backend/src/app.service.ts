"use strict"

const crypto = require("crypto");

const CHUNK_SIZE_PRIVATE_ENCRYPT = 116;
const CHUNK_SIZE_PUBLIC_ENCRYPT = 86;
const CHUNK_SIZE = 128;

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 1024,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: ''
      }
    });
    return keyPair;
  }

  privateEncrypt(payload, privateKey) {
    let result = [];
    while (payload.length >= CHUNK_SIZE_PRIVATE_ENCRYPT) {
      const chunk = payload.slice(0, CHUNK_SIZE_PRIVATE_ENCRYPT);
      payload = payload.slice(CHUNK_SIZE_PRIVATE_ENCRYPT);
      result.push(crypto.privateEncrypt({ key: privateKey, passphrase: '' }, chunk));
    }
    if (payload.length > 0) {
      result.push(crypto.privateEncrypt({ key: privateKey, passphrase: '' }, payload));
    }
    return Buffer.concat(result);
  }

  publicEncrypt(payload, publicKey) {
    let result = [];
    while (payload.length >= CHUNK_SIZE_PUBLIC_ENCRYPT) {
      const chunk = payload.slice(0, CHUNK_SIZE_PUBLIC_ENCRYPT);
      payload = payload.slice(CHUNK_SIZE_PUBLIC_ENCRYPT);
      result.push(crypto.publicEncrypt({ key: publicKey }, chunk));
    }
    if (payload.length > 0) {
      result.push(crypto.publicEncrypt({ key: publicKey }, payload));
    }
    return Buffer.concat(result);
  }

  publicDecrypt(payload, publicKey) {
    let result = [];
    while (payload.length >= CHUNK_SIZE) {
      const chunk = payload.slice(0, CHUNK_SIZE);
      payload = payload.slice(CHUNK_SIZE);
      result.push(crypto.publicDecrypt({ key: publicKey }, chunk));
    }
    if (payload.length > 0) {
      result.push(crypto.publicDecrypt({ key: publicKey }, payload));
    }
    return Buffer.concat(result);
  }

  privateDecrypt(payload, privateKey) {
    let result = [];
    while (payload.length >= CHUNK_SIZE) {
      const chunk = payload.slice(0, CHUNK_SIZE);
      payload = payload.slice(CHUNK_SIZE);
      result.push(crypto.privateDecrypt({ key: privateKey, passphrase: '' }, chunk));
    }
    if (payload.length > 0) {
      result.push(crypto.privateDecrypt({ key: privateKey, passphrase: '' }, payload));
    }
    return Buffer.concat(result);
  }


}
