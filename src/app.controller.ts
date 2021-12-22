import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { v4 as uuidv4 } from 'uuid';
const bs58 = require('bs58');

@Controller()
export class AppController {

  private uuid;

  private keys = {}

  private payloads = {}

  constructor(private readonly appService: AppService) {
    this.uuid = uuidv4();
    this.keys[this.uuid] = this.appService.getKeyPair();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/create")
  create() {
    let uuid = uuidv4();
    const keyPair = this.appService.getKeyPair();
    this.keys[uuid] = keyPair;
    return {
      uuid,
      ...keyPair
    };
  }

  @Post("/submit")
  submit(@Body() body: any) {
    if (!body?.uuid) {
      throw new Error("Missing UUID")
    }
    if (!this.keys[body.uuid]) {
      throw new Error("UUID not found")
    }
    this.payloads[body.uuid] = body;
  }

  @Get("/find")
  get() {
    const self = this;
    return Object.keys(this.payloads).map(uuid => {
      const payload = JSON.stringify(self.payloads[uuid]);
      const publicKey = self.keys[uuid].publicKey;
      const privateKey = self.keys[self.uuid].privateKey;
      const encrypted2 = this.appService.publicEncrypt(Buffer.from(payload), publicKey);
      // const encrypted1 = this.appService.privateEncrypt(Buffer.from(payload), privateKey);
      // const encrypted2 = this.appService.publicEncrypt(encrypted1, publicKey);
      return {
        uuid: uuid,
        data: bs58.encode(encrypted2)
      }
    })
  }

}
