import { Module } from '@nestjs/common';
import { PgpService } from './pgp.service';
import { PgpController } from './pgp.controller';
import { Template, TemplateSchema } from './schemas/template.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schemas/submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
      { name: Submission.name, schema: SubmissionSchema }
    ])
  ],
  providers: [PgpService],
  controllers: [PgpController]
})
export class PgpModule {}
