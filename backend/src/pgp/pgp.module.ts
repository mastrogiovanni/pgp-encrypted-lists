import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PgpService } from './pgp.service';
import { PgpController } from './pgp.controller';
import { Template, TemplateSchema } from './schemas/template.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { JWTMiddleware } from './jwt.middleware';

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
export class PgpModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTMiddleware)
      .forRoutes(
        'pgp/list',
        'pgp/score'
      );
  }
}
