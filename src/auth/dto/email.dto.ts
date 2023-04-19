import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
 
export class EmailDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
 
export default EmailDto;