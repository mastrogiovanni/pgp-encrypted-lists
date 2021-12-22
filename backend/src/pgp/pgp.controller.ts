import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create.template.dto';
import { LoginDto } from './dto/login.dto';
import { SubmissionDto } from './dto/submission.dto';
import { PgpService } from './pgp.service';

const PASSPHRASE = "super long and hard to guess secret"

@Controller('pgp')
export class PgpController {

    constructor(private pgpService: PgpService) {
    }

    @Post("/login")
    async login(@Body() loginDto: LoginDto) {
        return await this.pgpService.login(loginDto);        
    }

    @Post("/score/:idSubmission/:score")
    async score(@Param("idSubmission") idSubmission: string, score: number) {
        return await this.pgpService.setScore(idSubmission, score);
    }

    @Post("/create")
    async create(@Body() createTemplateDto: CreateTemplateDto) {
        return await this.pgpService.create(createTemplateDto);
    }

    @Post("/submit")
    async submit(@Body() submissionDto: SubmissionDto) {
        return await this.pgpService.submit(submissionDto);
    }

    @Get("/list/:idTemplate")
    async list(@Param("idTemplate") idTemplate: string) {
        return await this.pgpService.list(idTemplate);
    }

    @Get("/list/plain/:idTemplate")
    async listPlain(@Param("idTemplate") idTemplate: string) {
        return await this.pgpService.listPlain(idTemplate);
    }

}
