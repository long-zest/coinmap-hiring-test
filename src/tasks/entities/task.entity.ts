import { Exclude } from "class-transformer";
import { UserEntity } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tasks', {
    orderBy: {
        created_at: "DESC"
    }
})
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    title: string

    @Column({ nullable: true })
    description: string

    @CreateDateColumn()
    created_at: Date

    @ManyToOne(_type => UserEntity, user => user.tasks, { eager: false })
    @Exclude({ toPlainOnly: true })
    user: UserEntity
}
