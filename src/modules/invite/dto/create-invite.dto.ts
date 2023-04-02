import {IsNotEmpty, MaxLength, MinLength} from "class-validator";

export class CreateInviteDto {

    @IsNotEmpty()
    event_uuid: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    message: string;

}
