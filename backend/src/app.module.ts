import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PgpModule } from './pgp/pgp.module';

@Module({
  imports: [
    PgpModule,
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
