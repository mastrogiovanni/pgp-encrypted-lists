
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

var jwt = require('jsonwebtoken');
const JWT_TOKEN_SECRET = "stocazzo e tutt'uno";

@Injectable()
export class JWTMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const jwtToken = req.get("X-Auth-Token");
        console.log("Token:", jwtToken)
        if (jwtToken) {
            try {
                jwt.verify(jwtToken, JWT_TOKEN_SECRET, function(err, decoded) {
                    if (err) {
                        // console.log(err, jwtToken)
                        res.status(401);
                        res.send('Unauthorized access');
                    }
                    else {
                        console.log("Ok")
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
    }
}