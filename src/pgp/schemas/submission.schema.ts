import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Template } from './template.schema';
import * as mongoose from 'mongoose';

export type SubmissionDocument = Submission & Document;

// private submissions: Map < [string, string], { name: string, email: string, publicKey: string, payload: any } > = new Map();

@Schema()
export class Submission {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Template' })
    template: Template;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    publicKey: string;

    @Prop()
    payload: string;

    @Prop({ type: Date, default: Date.now() })
    submissionDate: Date;

    @Prop()
    score: number;

}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);