import { Router } from "express";
import { Routes } from "../interfaces/rotes.interface";
import UserController from "../controllers/user.controller";
import { validateToken } from "../utils/validateToken.util";


class UserRoute implements Routes {
    public signUp = '/v1/user/signup';
    public login = '/v1/user/login';
    public update = '/v1/user/update';
    public delete = '/v1/user/delete/:id';
    public getAllUser = '/v1/user';
    public searchUser = '/v1/user/search';
    public followUser = '/v1/user/follow';
    public router = Router();
    private userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.getAllUser}`, 
            this.userController.getAllUsers)
        this.router.get(`${this.searchUser}`, 
            this.userController.searchUsers)
        this.router.post(`${this.followUser}`, validateToken,
            this.userController.followUser)
        this.router.post(`${this.signUp}`,
            this.userController.signup);
        this.router.post(`${this.login}`,
            this.userController.login);
        this.router.put(`${this.update}`, validateToken,
            this.userController.update);
        this.router.delete(`${this.delete}`, validateToken,
            this.userController.delete);
    }
}

export default UserRoute;