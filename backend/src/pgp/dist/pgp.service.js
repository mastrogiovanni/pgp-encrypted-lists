"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PgpService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var openpgp_1 = require("openpgp");
var submission_schema_1 = require("./schemas/submission.schema");
var template_schema_1 = require("./schemas/template.schema");
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var openpgp = require('openpgp');
var PASSPHRASE = "-";
var JWT_TOKEN_SECRET = "stocazzo e tutt'uno";
var PgpService = /** @class */ (function () {
    function PgpService(templateModel, submissionModel) {
        this.templateModel = templateModel;
        this.submissionModel = submissionModel;
    }
    PgpService.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.submissionModel.deleteMany({})];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.templateModel.deleteMany({})];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PgpService.prototype.create = function (createTemplate) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, openpgp_1.generateKey({
                            curve: 'ed25519',
                            userIDs: [{ name: createTemplate.name, email: createTemplate.email }],
                            passphrase: PASSPHRASE
                        })];
                    case 1:
                        keys = _a.sent();
                        payload = {
                            name: createTemplate.name,
                            email: createTemplate.email,
                            privateKey: keys.privateKey,
                            publicKey: keys.publicKey,
                            revocationCertificate: keys.revocationCertificate
                        };
                        return [4 /*yield*/, new this.templateModel(payload).save()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PgpService.prototype.submit = function (submissionDto) {
        return __awaiter(this, void 0, void 0, function () {
            var template, keys, encryptedPayload, submission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.templateModel.findById(submissionDto.idTemplate)];
                    case 1:
                        template = _a.sent();
                        return [4 /*yield*/, openpgp_1.generateKey({
                                curve: 'ed25519',
                                userIDs: [{ name: submissionDto.name, email: submissionDto.email }],
                                passphrase: PASSPHRASE
                            })];
                    case 2:
                        keys = _a.sent();
                        return [4 /*yield*/, this.encrypt(submissionDto.payload, template.publicKey)];
                    case 3:
                        encryptedPayload = _a.sent();
                        return [4 /*yield*/, new this.submissionModel({
                                template: new mongoose.Types.ObjectId(submissionDto.idTemplate),
                                name: submissionDto.name,
                                email: submissionDto.email,
                                publicKey: keys.publicKey,
                                payload: encryptedPayload
                            }).save()];
                    case 4:
                        submission = _a.sent();
                        return [2 /*return*/, __assign({ id: submission._id }, keys)];
                }
            });
        });
    };
    PgpService.prototype.login = function (loginDto) {
        return __awaiter(this, void 0, void 0, function () {
            var template, signedMessage, publicKey, verificationResult, _a, verified, keyID, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if ((Date.now() - loginDto.timestamp) > 1000) {
                            throw new Error("Expired timestamp");
                        }
                        return [4 /*yield*/, this.templateModel.findById(loginDto.idTemplate)];
                    case 1:
                        template = _b.sent();
                        return [4 /*yield*/, openpgp_1.readCleartextMessage({
                                cleartextMessage: loginDto.signedTimestamp
                            })];
                    case 2:
                        signedMessage = _b.sent();
                        return [4 /*yield*/, openpgp_1.readKey({ armoredKey: template.publicKey })];
                    case 3:
                        publicKey = _b.sent();
                        return [4 /*yield*/, openpgp.verify({
                                message: signedMessage,
                                verificationKeys: publicKey
                            })];
                    case 4:
                        verificationResult = _b.sent();
                        _a = verificationResult.signatures[0], verified = _a.verified, keyID = _a.keyID;
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, verified];
                    case 6:
                        _b.sent(); // throws on invalid signature
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _b.sent();
                        throw new Error('Signature could not be verified: ' + e_1.message);
                    case 8: return [2 /*return*/, jwt.sign({
                            data: {
                                idTemplate: loginDto.idTemplate
                            },
                            exp: Math.floor(Date.now() / 1000) + (60 * 60)
                        }, JWT_TOKEN_SECRET)];
                }
            });
        });
    };
    PgpService.prototype.setScore = function (idSubmission, score) {
        return __awaiter(this, void 0, void 0, function () {
            var submission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.submissionModel.findById(idSubmission)];
                    case 1:
                        submission = _a.sent();
                        submission.score = score;
                        return [2 /*return*/, submission.save()];
                }
            });
        });
    };
    /**
     * Decrypt payload's submissions internally and encrypt with single public keys
     *
     * @param idTemplate
     * @returns
     */
    PgpService.prototype.list = function (idTemplate) {
        return __awaiter(this, void 0, void 0, function () {
            var self, template, items, results, _i, items_1, item, decrypted, encrypted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, this.templateModel.findById(idTemplate)];
                    case 1:
                        template = _a.sent();
                        return [4 /*yield*/, this.submissionModel.find({
                                template: new mongoose.Types.ObjectId(idTemplate)
                            })];
                    case 2:
                        items = _a.sent();
                        results = [];
                        _i = 0, items_1 = items;
                        _a.label = 3;
                    case 3:
                        if (!(_i < items_1.length)) return [3 /*break*/, 7];
                        item = items_1[_i];
                        return [4 /*yield*/, this.decrypt(item.payload, template.privateKey)];
                    case 4:
                        decrypted = _a.sent();
                        return [4 /*yield*/, this.encrypt(decrypted, item.publicKey)];
                    case 5:
                        encrypted = _a.sent();
                        results.push({
                            submissionId: item._id.toString(),
                            score: item.score,
                            encrypted: encrypted
                        });
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/, results];
                }
            });
        });
    };
    PgpService.prototype.listPlain = function (idTemplate) {
        return __awaiter(this, void 0, void 0, function () {
            var self, template, items, results, _i, items_2, item, decrypted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, this.templateModel.findById(idTemplate)];
                    case 1:
                        template = _a.sent();
                        return [4 /*yield*/, this.submissionModel.find({
                                template: new mongoose.Types.ObjectId(idTemplate)
                            })];
                    case 2:
                        items = _a.sent();
                        results = [];
                        _i = 0, items_2 = items;
                        _a.label = 3;
                    case 3:
                        if (!(_i < items_2.length)) return [3 /*break*/, 6];
                        item = items_2[_i];
                        return [4 /*yield*/, this.decrypt(item.payload, template.privateKey)];
                    case 4:
                        decrypted = _a.sent();
                        results.push({
                            submissionId: item._id.toString(),
                            score: item.score,
                            plain: decrypted
                        });
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, results];
                }
            });
        });
    };
    PgpService.prototype.decrypt = function (payload, privateKeyArmored) {
        return __awaiter(this, void 0, void 0, function () {
            var message, privateKey, _a, _b, decrypted;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, openpgp_1.readMessage({
                            armoredMessage: payload // parse armored message
                        })];
                    case 1:
                        message = _c.sent();
                        _a = openpgp_1.decryptKey;
                        _b = {};
                        return [4 /*yield*/, openpgp_1.readPrivateKey({ armoredKey: privateKeyArmored })];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [(_b.privateKey = _c.sent(),
                                _b.passphrase = PASSPHRASE,
                                _b)])];
                    case 3:
                        privateKey = _c.sent();
                        return [4 /*yield*/, openpgp_1.decrypt({
                                message: message,
                                decryptionKeys: privateKey
                            })];
                    case 4:
                        decrypted = _c.sent();
                        return [2 /*return*/, JSON.parse(decrypted.data)];
                }
            });
        });
    };
    PgpService.prototype.encrypt = function (payload, publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = openpgp_1.encrypt;
                        _b = {};
                        return [4 /*yield*/, openpgp_1.createMessage({ text: JSON.stringify(payload) })];
                    case 1:
                        _b.message = _c.sent();
                        return [4 /*yield*/, openpgp_1.readKey({ armoredKey: publicKey })];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [(_b.encryptionKeys = _c.sent(),
                                _b)])];
                    case 3: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    PgpService = __decorate([
        common_1.Injectable(),
        __param(0, mongoose_1.InjectModel(template_schema_1.Template.name)),
        __param(1, mongoose_1.InjectModel(submission_schema_1.Submission.name))
    ], PgpService);
    return PgpService;
}());
exports.PgpService = PgpService;
