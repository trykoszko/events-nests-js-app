import {Event} from "../entities/event.entity";
import * as dayjs from "dayjs";
import {User} from "../../user/entities/user.entity";

export class EventPublicResponseDto {

    id: number;
    uuid: string;
    title: string;
    slug: string;
    location_city: string;
    location_country: string;
    description: string;
    slots: number;
    slots_left: number;
    date_time: Date;
    starts_in_days: number;
    duration: number;
    background_image_url: string;

    type: string;
    owner: any;

    public static fromEntity(entity: Event, user?: User): any {
        const dto = new EventPublicResponseDto();

        dto.id = entity.id;
        dto.uuid = entity.uuid;
        dto.title = entity.title;
        dto.slug = entity.slug;
        dto.location_city = entity.location_city;
        dto.location_country = entity.location_country;
        dto.description = entity.description;
        dto.slots = entity.slots;
        dto.slots_left = entity.users_joined ? (entity.slots - entity.users_joined.length) : entity.slots;

        dto.date_time = entity.date_time;
        dto.starts_in_days = (dayjs(entity.date_time)).diff(dayjs(new Date()), 'day', false);
        dto.duration = entity.duration;

        dto.background_image_url = entity.background_image_url;

        dto.type = entity.type.title;

        dto.owner = {
            first_name: entity.owner.first_name,
            last_name: entity.owner.last_name.substring(0, 1) + '.',
            location_city: entity.owner.location_city,
            avatar_url: entity.owner.avatar_url,
        };
        
        return dto;
    }

}
