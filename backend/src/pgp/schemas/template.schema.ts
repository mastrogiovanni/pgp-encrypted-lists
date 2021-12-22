import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TemplateDocument = Template & Document;

@Schema()
export class Template {

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  privateKey: string;

  @Prop()
  publicKey: string;

  @Prop()
  revocationCertificate: string;

  @Prop({ type: Object })
  payload: any;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);