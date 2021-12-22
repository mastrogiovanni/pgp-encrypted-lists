"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PgpModule = void 0;
var common_1 = require("@nestjs/common");
var pgp_service_1 = require("./pgp.service");
var pgp_controller_1 = require("./pgp.controller");
var template_schema_1 = require("./schemas/template.schema");
var mongoose_1 = require("@nestjs/mongoose");
var submission_schema_1 = require("./schemas/submission.schema");
var jwt_middleware_1 = require("./jwt.middleware");
var PgpModule = /** @class */ (function () {
    function PgpModule() {
    }
    PgpModule.prototype.configure = function (consumer) {
        consumer
            .apply(jwt_middleware_1.JWTMiddleware)
            .forRoutes('pgp/list', 'pgp/score');
    };
    PgpModule = __decorate([
        common_1.Module({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    { name: template_schema_1.Template.name, schema: template_schema_1.TemplateSchema },
                    { name: submission_schema_1.Submission.name, schema: submission_schema_1.SubmissionSchema }
                ])
            ],
            providers: [pgp_service_1.PgpService],
            controllers: [pgp_controller_1.PgpController]
        })
    ], PgpModule);
    return PgpModule;
}());
exports.PgpModule = PgpModule;
