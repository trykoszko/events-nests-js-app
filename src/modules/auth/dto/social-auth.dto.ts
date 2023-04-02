import { IsEmail, IsNumberString, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class SocialAuthDto {

    @IsNumberString()
    @MinLength(2)
    id: string;

    @IsEmail()
    @MinLength(2)
    email: string;

    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsUrl()
    @IsOptional()
    link: string;

    @IsUrl()
    @IsOptional()
    image_url: string;

}
