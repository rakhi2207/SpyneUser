import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export function validateToken(req: Request, res: Response, next: NextFunction) {
    const authorization = req.get('Authorization');
    if(!authorization){
        res.status(401).json({
            message: 'Not Authorized'
        })
    }
    const token = authorization.split(" ")[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        if(!decodedToken){
            res.status(401).json({
                message: 'Not Authorized'
            })
        }else{
            req['user'] = decodedToken;
            next();
        }
    }catch(error){
        res.status(401).json({
            message: error
        })
    }
}