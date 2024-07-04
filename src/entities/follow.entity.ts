import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "follow"})
export class Follow{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'follower_id' })
    follower_id: User;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'followee_id' })
    followee_id: User;

    @Column({ name: 'created_at' })
    created_at: Date;

    @Column({ nullable: true, name: 'updated_by' })
    updated_by: string;

    @Column({ nullable: true, name: 'updated_at' })
    updated_at: Date;
}