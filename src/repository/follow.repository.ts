import { DataSource, In, Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from './user.repository';

export class FollowRepository extends Repository<Follow>
{
    private userRepo: UserRepository;
    constructor(
        dataSource: DataSource,
        userRepo: UserRepository
    ) {
        super(Follow, dataSource.createEntityManager());
        this.userRepo = userRepo;
    }

    public async followUser(followerId: string, followeeId: string){
        const user = await this.userRepo.getUser([followeeId, followerId]);
        const followerUser = user.find(value => value.id == followerId);
        const followeeUser = user.find(value => value.id == followeeId);
        if(!followeeUser || !followerUser){
            return {
                message: "Either follower or followee id is wrong",
                status: StatusCodes.BAD_REQUEST
            }
        }

        const entity = new Follow();
        entity.followee_id = followeeUser;
        entity.follower_id = followerUser;
        this.save(entity);

        return {
            data: "successfully followed",
            statusCode: StatusCodes.OK
        }
    }
}

