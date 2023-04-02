import {User} from "../entities/user.entity";
import * as dayjs from "dayjs";

export class UserPublicResponseDto {

    uuid: string;
    first_name: string;
    last_name: string;
    location_city: string;
    age: number;
    avatar_url: string;

    public static fromEntity(entity: User): any {
        const now = dayjs(new Date());
        
        const dto = new UserPublicResponseDto();

        dto.uuid = entity.uuid;
        dto.first_name = entity.first_name;
        dto.last_name = entity.last_name.substring(0, 1) + '.';
        dto.location_city = entity.location_city;
        dto.age = now.diff(dayjs(entity.birthdate), 'year', false);
        dto.avatar_url = entity.avatar_url;

        return dto;
    }

}
