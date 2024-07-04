import { StatusCodes } from "http-status-codes";
import { dataSource } from "../config/db.config";
import { updateUserData, user, userLogin } from "../interfaces/user.interface";
import { UserRepository } from "../repository/user.repository";
import { getToken } from "../utils/token.util";
import { FollowRepository } from "../repository/follow.repository";

class UserService {
    private user: UserRepository;
    private follow: FollowRepository;

    constructor() {
        this.user = new UserRepository(dataSource);
        this.follow = new FollowRepository(dataSource, this.user);
    }

    public createUser = async (userData: user) => {
        return await this.user.createUser(userData);
    };

    public loginUser = async (userData: userLogin) => {
        return await this.user.validateLoginDetails(userData);
    };

    public updateUser = async (userData: updateUserData) => {
        return await this.user.updateUser(userData);
    };

    public deleteUser = async (id: string) => {
        return await this.user.deleteUser(id);
    };

    public getAllUsers = async () => {
        return await this.user.getAllUsers();
    };

    public searchUsers = async (name: string) => {
        return await this.user.searchUsers(name);
    };

    public followUser = async (followerId: string, followeeId: string) => {
        return await this.follow.followUser(followerId, followeeId);
    };


}

export default UserService;