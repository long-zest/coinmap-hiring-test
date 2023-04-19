import { TaskEntity } from "../../tasks/entities/task.entity";

export interface UserResponse {
  id: number;
  email: string;
  is_email_confirmed: boolean;
  tasks: TaskEntity[]
}
