import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './models/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import EmailDto from './dto/email.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepo: UsersService,
        private jwtService: JwtService,
        private mailerService: MailerService,
        private configService: ConfigService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<any> {

        const user = await this.usersRepo.createUser(authCredentialsDto)
        
        if(user) {
            this.sendVerificationEmail(authCredentialsDto.email)
            return { message: 'Sign up success. Plz check your mail for confirm your account.' }
        } else {
            throw new InternalServerErrorException()
        }
    }

    async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
        const { email, password } = signInDto
        const user = await this.usersRepo.findUserByEmail(email)

        if (user && (await bcrypt.compare(password, user.password))) {
            const is_email_confirmed = user.is_email_confirmed
            const payload: JwtPayload = { email, is_email_confirmed }
            const accessToken = await this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException('Plz check your login credentials')
        }
    }

    async sendVerificationEmail(email: string): Promise<void> {
        const payload = { email: email, confirmCode: 'forConfirm' };
        const secretKey = this.configService.get('JWT_SECRET');
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        
        await this.mailerService.sendMail({
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is: ${token}`,
        });
    }

    async confirmEmail(tokenFromMail: string): Promise<any> {
        const secretKey = this.configService.get('JWT_SECRET');
        const token = tokenFromMail;
        try {
            const decoded:any = jwt.verify(token, secretKey);
            const email = decoded.email
            
            const confirmCode = decoded?.confirmCode
            if(confirmCode != 'forConfirm') throw new BadRequestException('Opps something went wrong with your token')
            
            const user = await this.usersRepo.findUserByEmail(email)

            if(!user) { throw new NotFoundException("Cannot find your account with this email.") }
            if(user.is_email_confirmed) throw new BadRequestException('Email already confirmed')

            await this.usersRepo.updateConfirmStatus(email)

            return { message: 'Confirm email success.' }
        } catch (error) {
            if(error.response?.statusCode) {
                return error.response
            } else {
                throw new BadRequestException()     
            }
        }
    }

    async checkConfirm(email: EmailDto): Promise<boolean>{
        const user = await this.usersRepo.findUserByEmail(email.email)
        if(!user) throw new NotFoundException("Cannot find your account with this email.")
        return user.is_email_confirmed
    }

    async resendEmail(email: EmailDto): Promise<any>{
        const check = await this.checkConfirm(email)
        
        if(!check) {
            this.sendVerificationEmail(email.email)
            return { message: 'Confirm mail resended.' }
        } else {
            throw new BadRequestException('Email already confirmed')
        }
    }

}
