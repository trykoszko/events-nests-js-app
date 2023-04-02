import {IsBooleanString, IsDateString, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUrl, MaxLength, MinLength, Validate} from "class-validator";
import * as dayjs from "dayjs";
import { IsAdultConstraint } from "../validators/is-adult.constraint";

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(40)
    password: string;

    @IsString()
    @MinLength(2)
    @MaxLength(60)
    first_name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(60)
    last_name: string;

    @IsString()
    @MinLength(1)
    @MaxLength(1)
    gender: string;

    @Validate(IsAdultConstraint)
    @IsDateString()
    birthdate: Date;

    @IsString()
    @MinLength(2)
    @MaxLength(40)
    location_city: string;

    @IsString()
    @MinLength(2)
    @MaxLength(40)
    location_country: string;

    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @IsOptional()
    bio: string;

    @IsUrl()
    @IsOptional()
    avatar_url: string;
    
    @IsUrl()
    @IsOptional()
    social_url_instagram: string;
    
    @IsUrl()
    @IsOptional()
    social_url_facebook: string;
    
    @IsNumberString()
    @IsOptional()
    facebook_user_id: string;

    @IsBooleanString()
    @IsOptional()
    terms_accepted: boolean;

    @IsNumberString()
    @IsOptional()
    permissions?: number;

    @IsBooleanString()
    @IsOptional()
    is_active?: boolean;

    @IsString()
    @IsOptional()
    confirmation_token?: string;
}
