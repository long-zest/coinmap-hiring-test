import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import ConfirmEmailDto from './dto/confirm-email.dto';
import EmailDto from './dto/email.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
        return this.authService.signUp(authCredentialsDto)
    }

    @Post('/signin')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }

    @Post('/confirm')
    confirm(@Body() confirmationData: ConfirmEmailDto) {
        return this.authService.confirmEmail(confirmationData.token)
    }

    @Post('/resend')
    resendMail(@Body() email: EmailDto) {
        return this.authService.resendEmail(email)
    }

    @Post('/check')
    checkEmailConfirm(@Body() email: EmailDto) {
        return this.authService.checkConfirm(email)
    }

}
