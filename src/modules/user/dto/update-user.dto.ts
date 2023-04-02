import {PartialType} from '@nestjs/mapped-types';
import { IsDateString, IsEmail, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import {CreateUserDto} from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsDateString()
    @IsOptional()
    birthdate?: Date;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    bio?: string;

    @IsUrl()
    @IsOptional()
    social_url_instagram?: string;

    @IsUrl()
    @IsOptional()
    social_url_facebook?: string;

    @IsString()
    @IsOptional()
    location_city?: string;
}
