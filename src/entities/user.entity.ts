import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'phoneNumber', unique: true })
    phoneNumber: string;

    @Column({ name: 'is_active', type: 'tinyint', nullable: false })
    isActive: boolean;

    @Column({  name: 'email', unique: true })
    email: string;

    @Column({ name: 'password' })
    password: string;

    @Column({ name: 'created_at' })
    created_at: Date;

    @Column({ nullable: true, name: 'updated_by' })
    updated_by: string;

    @Column({ nullable: true, name: 'updated_at' })
    updated_at: Date;
}
