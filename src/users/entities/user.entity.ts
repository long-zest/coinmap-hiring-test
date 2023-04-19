import { TaskEntity } from "../../tasks/entities/task.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string
    
    @Column()
    password: string

    @Column({ default: false })
    is_email_confirmed: boolean;

    @CreateDateColumn()
    created_at: Date

    @OneToMany(_type => TaskEntity, task => task.user, {eager: true})
    tasks: TaskEntity[]
}