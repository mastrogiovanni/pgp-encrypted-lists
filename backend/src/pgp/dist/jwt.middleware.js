"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JWTMiddleware = void 0;
var common_1 = require("@nestjs/common");
var jwt = require('jsonwebtoken');
var JWT_TOKEN_SECRET = "stocazzo e tutt'uno";
var JWTMiddleware = /** @class */ (function () {
    function JWTMiddleware() {
    }
    JWTMiddleware.prototype.use = function (req, res, next) {
        var jwtToken = req.get("X-Auth-Token");
        console.log("Token:", jwtToken);
        if (jwtToken) {
            try {
                jwt.verify(jwtToken, JWT_TOKEN_SECRET, function (err, decoded) {
                    if (err) {
                        // console.log(err, jwtToken)
                        res.status(401);
                        res.send('Unauthorized access');
                    }
                    else {
                        console.log("Ok");
                        req['data'] = decoded.data;
                        next();
                    }
                });
            }
            catch (e) {
                // console.log(e)
                res.status(401);
                res.send('Unauthorized access');
            }
        }
        else {
            // console.log("Error", jwtToken)
            res.status(401);
            res.send('Unauthorized access');
        }
    };
    JWTMiddleware = __decorate([
        common_1.Injectable()
    ], JWTMiddleware);
    return JWTMiddleware;
}());
exports.JWTMiddleware = JWTMiddleware;
