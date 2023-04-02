import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(40)
    password: string;

    @IsNotEmpty()
    password_reset_token: string | null;

}
