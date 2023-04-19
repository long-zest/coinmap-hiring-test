import { WebSocketGateway, WebSocketServer, SubscribeMessage, BaseWsExceptionFilter } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { UseFilters } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import ConfirmEmailDto from './dto/confirm-email.dto';
import EmailDto from './dto/email.dto';
import { WsException } from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class AuthGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly authService: AuthService) { }

    @UseFilters(new BaseWsExceptionFilter())
    @SubscribeMessage('signUp')
    async handleSignUp(_client: any, authCredentialsDto: AuthCredentialsDto): Promise<any> {
        
        const myData = plainToInstance(AuthCredentialsDto, authCredentialsDto);

        const errors = await validate(myData);

        if (errors.length > 0) {
            throw new WsException({
                statusCode: 400,
                message: "Bad Request.",
            });
        }

        try {
            const user = await this.authService.signUp(authCredentialsDto);
            return user;
        } catch (error) {
            return error.response  
        }
    }

    @UseFilters(new BaseWsExceptionFilter())
    @SubscribeMessage('signIn')
    async handleSignIn(_client: any, signInDto: SignInDto): Promise<any> {
        
        const myData = plainToInstance(SignInDto, signInDto);

        const errors = await validate(myData);

        if (errors.length > 0) {
            throw new WsException({
                statusCode: 400,
                message: "Bad Request.",
            });
        }

        try {
            const user = await this.authService.signIn(signInDto);
            return user;
        } catch (error) {
            return error.response  
        }
    }

    @UseFilters(new BaseWsExceptionFilter())
    @SubscribeMessage('confirmMail')
    async handleConfirm(_client: any, confirmationData: ConfirmEmailDto): Promise<any> {
        
        const myData = plainToInstance(ConfirmEmailDto, confirmationData);

        const errors = await validate(myData);

        if (errors.length > 0) {
            throw new WsException({
                statusCode: 400,
                message: "Bad Request.",
            });
        }

        try {
            const user = await this.authService.confirmEmail(confirmationData.token);
            return user;
        } catch (error) {
            return error.response  
        }
    }

    @UseFilters(new BaseWsExceptionFilter())
    @SubscribeMessage('checkEmailConfirm')
    async handleCheckEmailConfirm(_client: any, email: EmailDto): Promise<any> {
        
        const myData = plainToInstance(EmailDto, email);

        const errors = await validate(myData);

        if (errors.length > 0) {
            throw new WsException({
                statusCode: 400,
                message: "Bad Request.",
            });
        }

        try {
            const user = await this.authService.checkConfirm(email);
            return user;
        } catch (error) {
            return error.response  
        }
    }

    @UseFilters(new BaseWsExceptionFilter())
    @SubscribeMessage('resendEmailConfirm')
    async handleResendMail(_client: any, email: EmailDto): Promise<any> {
        
        const myData = plainToInstance(EmailDto, email);

        const errors = await validate(myData);

        if (errors.length > 0) {
            throw new WsException({
                statusCode: 400,
                message: "Bad Request.",
            });
        }

        try {
            const user = await this.authService.resendEmail(email);
            return user;
        } catch (error) {
            return error.response  
        }
    }
}
