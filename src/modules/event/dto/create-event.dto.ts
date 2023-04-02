import {EventType} from "../entities/event-type.entity";
import {
    IsBooleanString,
    IsDateString,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsUrl,
    MaxLength,
    MinLength
} from "class-validator";

export class CreateEventDto {

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(100)
    title: string;

    @IsNotEmpty()
    location_city: string;

    @IsNotEmpty()
    location_country: string;

    @IsNotEmpty()
    @MinLength(20)
    @MaxLength(500)
    description: string;

    @IsNotEmpty()
    @IsNumberString()
    slots: number;

    @IsNotEmpty()
    @IsDateString()
    date_time: Date;

    @IsNotEmpty()
    @IsNumberString()
    duration: number;

    @IsUrl()
    @IsOptional()
    background_image_url: string;

    @IsNotEmpty()
    @IsBooleanString()
    is_open: boolean;

    @IsNotEmpty()
    @IsBooleanString()
    is_address_visible: boolean;

    @IsNotEmpty()
    @IsBooleanString()
    is_userlist_visible: boolean;

    @IsNotEmpty()
    @IsBooleanString()
    is_allowed_to_join_when_in_progress: boolean;

    @IsNotEmpty()
    type: EventType;

}
