import { EventResponseDto } from "../../event/dto/event.response.dto";
import { UserResponseDto } from "../../user/dto/user.response.dto";
import { Invite } from "../entities/invite.entity";

export class InvitePublicResponseDto {

    uuid: string;
    message: string;

    owner: UserResponseDto;
    event: EventResponseDto;

    public static fromEntity(entity: Invite): any {
        const dto = new InvitePublicResponseDto();

        dto.uuid = entity.uuid;
        dto.message = entity.message;

        dto.owner = UserResponseDto.fromEntity(entity.owner);
        dto.event = EventResponseDto.fromEntity(entity.event);

        return dto;
    }

}
