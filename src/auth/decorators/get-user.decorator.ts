import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserResponse } from "../models/user-response.interface";

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): UserResponse => {
    const req = ctx.switchToHttp().getRequest()
    return req.user
})