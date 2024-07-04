import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../middlewares/api.response.middleware';
import UserService from '../services/user.service';
import { validateEmail } from '../utils/func.util';
import { user, userLogin } from '../interfaces/user.interface';

class UserController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public createUsers = async (userData: user, res: Response) => {
        const validation = this.validateUserData(userData, res);
        if(userData.mobileNo.toString().length !== 10){
            return {
                message: 'Invalid Phone Number',
                statusCode: StatusCodes.NOT_ACCEPTABLE
            }    
        }
        if(Object.keys(validation).length > 0){
            return validation;
        }
        const response = await this.userService.createUser(userData);
        return response;
    }

    private validateUserData(userData: user | userLogin, res: Response){
        const isEmailCorrect = validateEmail(userData.email);
        let response = {};
        if(!isEmailCorrect){
            response =  {
                message: 'Invalid Email',
                statusCode: StatusCodes.NOT_ACCEPTABLE
            }
        }
        if(userData.password.length < 5){
            response = {
                message: 'Password length is less than 5',
                statusCode: StatusCodes.NOT_ACCEPTABLE
            }
        }
        return response;
    }

    sendResponse = (response, res:Response) => {
        if(response.statusCode === StatusCodes.OK){
            ApiResponse.result(res, response.data, StatusCodes.OK);
        }else{
            ApiResponse.error(res, StatusCodes.BAD_REQUEST, response.message);
        }
    }

    public signup = async (req: Request, res: Response) => {
        const userData = {
            name: req.body.name,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            password: req.body.password
        }
        const response = await this.createUsers(userData, res);
        this.sendResponse(response, res);
    }

    public login = async (req: Request, res: Response) => {
        const userData = {
            email: req.body.email,
            password: req.body.password
        }
        this.validateUserData(userData, res);
        const response = await this.userService.loginUser(userData);
        this.sendResponse(response, res);
    }

    sendInvalidTokenError(res: Response, message: string){
        this.sendResponse({
            message,
            statusCode: StatusCodes.BAD_REQUEST
        }, res);
    }
    public update = async (req: Request, res: Response) => {
        const userData = {
            id: req.body.id,
            name: req.body.name,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            password: req.body.password
        }
        this.validateUserData(userData, res);
        if(req['user'].id !== userData.id){
            this.sendInvalidTokenError(res, "Invalid token");
        }else{
            const response = await this.userService.updateUser(userData);
            this.sendResponse(response, res);
        }
    }

    public delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        if(req['user'].id.toString() !== id.toString()){
            this.sendInvalidTokenError(res, "Invalid token");
        }else{
            const response = await this.userService.deleteUser(id);
            this.sendResponse(response, res);
        }
    }

    public getAllUsers = async (req: Request, res: Response) => {
        const response = await this.userService.getAllUsers();
        this.sendResponse(response, res);
    }

    public searchUsers = async (req: Request, res: Response) => {
        const name = req.query.name as string;
        if(!name){
            this.sendInvalidTokenError(res, "Name Not Available");
        }else{
            const response = await this.userService.searchUsers(name);
            this.sendResponse(response, res);
        }
    }

    public followUser = async (req: Request, res: Response) => {
        const { followerId, followeeId } = req.body;
        if(!followerId || !followeeId){
            this.sendInvalidTokenError(res, "Either follower or followee id not available");
        }else if(req['user'].id.toString() !== followerId.toString()){
            this.sendInvalidTokenError(res, "Invalid token");
        }
        else{
            const response = await this.userService.followUser(followerId, followeeId);
            this.sendResponse(response, res);
        }
    }

}

export default UserController;