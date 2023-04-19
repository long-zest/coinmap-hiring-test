import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {
    @IsNumber()
    @IsOptional()
    id: number

    @IsNotEmpty()
    title: string
    
    @IsString()
    @IsOptional()
    description?: string
}
