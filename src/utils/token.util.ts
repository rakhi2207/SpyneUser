import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { user } from '../interfaces/user.interface';

dotenv.config();

export function getToken(userData: user) {
    const token = jwt.sign(userData, process.env.TOKEN_KEY, {expiresIn: '1h'});
    return token;
}