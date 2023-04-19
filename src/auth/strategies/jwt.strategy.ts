import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserResponse } from "../models/user-response.interface";
import { UserEntity } from "../../users/entities/user.entity";
import { JwtPayload } from "../models/jwt-payload.interface";
import { buildUserDataResponse } from "./build-user-respone";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UsersService,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }
    
    async validate(payload: JwtPayload): Promise<UserResponse> {
        const { email } = payload
        const result: UserEntity = await this.userRepository.findUserByEmail(email)

        if(!result) {
            throw new UnauthorizedException()
        }

        const user = buildUserDataResponse(result)

        return user
    }
}