import { DataSource, In, Like, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { updateUserData, user, userLogin } from '../interfaces/user.interface';
import  bcrypt  from 'bcrypt'
import { StatusCodes } from 'http-status-codes';
import { getToken } from '../utils/token.util';

export class UserRepository extends Repository<User>
{
    constructor(dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    getTokenData(data: updateUserData){
        return {
            data: getToken(data),
            statusCode: StatusCodes.OK
        }
    }

    handleError(err){
        return {
            message: err.code,
            statusCode: StatusCodes.BAD_REQUEST
        }
    }

    async validateIsUserExist(userData: user){
        const data = await this.createQueryBuilder('user')
        .where(`user.email = '${userData.email}' or user.phoneNumber = '${userData.mobileNo}'`)
        .getRawMany();
        return data;
    }
    async createUser(userData: user){
        try{
            let id = '';
            const data = await this.validateIsUserExist(userData);
            if(data.length){
                id = data[0].user_id;
                this.createQueryBuilder('user')
                .update()
                .set({
                    isActive: true
                })
                .where(`user.email = '${userData.email}' or user.phoneNumber = '${userData.mobileNo}'`)
                .execute();
            } else{
                const entity = new User();
                entity.name = userData.name;
                entity.email = userData.email;
                entity.password = await bcrypt.hash(userData.password, 12);
                entity.created_at = new Date();
                entity.phoneNumber = userData.mobileNo;
               const data = await this.save(entity);
               id = data.id;  
            }
            return this.getTokenData({...userData, id}); 
        }catch(err){
            return this.handleError(err);
        }
    }

    async validateLoginDetails(userData: userLogin){
        let entity = {} as User;
        try{
            entity = await this.findOne({
                where:{
                    email: userData.email
                }
            });
            if(!entity){
                return {
                    message: "Invalid email",
                    status: StatusCodes.UNAUTHORIZED
                }
            }
    
            const isPasswordMatched = await bcrypt.compare(userData.password, entity.password);
            if(!isPasswordMatched){
                return {
                    message: "Invalid password",
                    status: StatusCodes.UNAUTHORIZED
                }
            }
    
            const data = {
                id: entity.id,
                name: entity.name,
                email: entity.email,
                mobileNo: entity.phoneNumber,
                password: entity.password 
            }
            return this.getTokenData(data);
        }catch(err){
           return this.handleError(err);
        }
    }

    async updateUser(userData: updateUserData){
        try{
            await this
            .createQueryBuilder('User')
            .update()
            .set({
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.mobileNo,
                password: await bcrypt.hash(userData.password, 12),
                updated_at: new Date()
            })
            .where({
                id: userData.id
            }).execute();

            return {
                data: "Successfully Updated",
                statusCode: StatusCodes.OK
            }
        }catch(err){
           return this.handleError(err);
        }
    }

    public async deleteUser(id: string){
        try{
            await this
            .createQueryBuilder('user')
            .update()
            .set({ isActive: false, updated_at: new Date() })
            .where({ id })
            .execute();
            return {
                data: "successfully deleted",
                statusCode: StatusCodes.OK
            }
        }catch(err){
            return this.handleError(err);
        }
    }

    public async getAllUsers(){
        try{
            const data = await this.find({
                where:{
                    isActive: true
                }
            });
            return {
                data,
                statusCode: StatusCodes.OK
            }
        }catch(err){
            return this.handleError(err);
        }
    }
    public async searchUsers(name: string){
        try{
            const data = await this.find({
                where:{
                    name: Like(`%${name}%`),
                    isActive: true
                }
            });
            return {
                data,
                statusCode: StatusCodes.OK
            }
        }catch(err){
            return this.handleError(err);
        }
    }
    public async getUser(userId: string[]){
        return await this.find({
            where: {
                id: In(userId),
                isActive: true
            }
        });
    }
}