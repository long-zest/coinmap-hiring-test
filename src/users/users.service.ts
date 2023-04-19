import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly user: Repository<UserEntity>,
    ) { }
    
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<boolean> {
        const { email, password } = authCredentialsDto

        // This thing for hash password
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const user = this.user.create({ email, password: hashedPassword })
        
        try {
            await this.user.save(user)
            return true;
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async findUserByEmail(email: string): Promise<any> {
        const result = await this.user.findOne({where: {email: email}})
        return result
    }

    async updateConfirmStatus(email: string): Promise<void> {
        await this.user.update({ email }, {
            is_email_confirmed: true
        })
    }

    async checkConfirmStatus(email: string): Promise<boolean>{
        const result = await this.findUserByEmail(email)
        if(result.is_email_confirmed) {
            return true
        } else {
            return false
        }
    }
    
}
