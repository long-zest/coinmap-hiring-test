import { UserResponse } from "../models/user-response.interface";
import { UserEntity } from "../../users/entities/user.entity";

export function buildUserDataResponse(data: UserEntity): UserResponse {
    return {
        id: data.id,
        email: data.email,
        is_email_confirmed: data.is_email_confirmed,
        tasks: data.tasks
    };
}
