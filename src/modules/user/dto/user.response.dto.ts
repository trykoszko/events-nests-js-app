import {User} from "../entities/user.entity";
import * as dayjs from "dayjs";

export class UserResponseDto {

    uuid: string;
    first_name: string;
    last_name: string;
    location_city: string;
    location_country: string;
    age: number;
    bio: string;
    avatar_url: string;
    social_url_instagram: string;
    social_url_facebook: string;

    public static fromEntity(entity: User): any {
        const dto = new UserResponseDto();
        dto.uuid = entity.uuid;
        dto.first_name = entity.first_name;
        dto.last_name = entity.last_name;
        dto.location_city = entity.location_city;
        dto.location_country = entity.location_country;
        dto.bio = entity.bio;

        const now = dayjs(new Date());
        dto.age = now.diff(dayjs(entity.birthdate), 'year', false);

        dto.avatar_url = entity.avatar_url;
        dto.social_url_instagram = entity.social_url_instagram;
        dto.social_url_facebook = entity.social_url_facebook;
        return dto;
    }

}
