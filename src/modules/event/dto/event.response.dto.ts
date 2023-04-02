import {Event} from "../entities/event.entity";
import * as dayjs from "dayjs";
import {UserResponseDto} from "../../user/dto/user.response.dto";
import {EventType} from "../entities/event-type.entity";
import {User} from "../../user/entities/user.entity";
import { UserPublicResponseDto } from "../../user/dto/user.public-response.dto";

export class EventResponseDto {

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

    is_open: boolean;
    is_address_visible: boolean;
    is_userlist_visible: boolean;
    is_allowed_to_join_when_in_progress: boolean;

    type: EventType;
    owner: UserResponseDto;

    users_joined?: UserResponseDto[];
    users_rejected?: UserResponseDto[];
    users_pending?: UserResponseDto[];
    users_removed?: UserResponseDto[];

    joined_status?: string;

    public static fromEntity(entity: Event, user?: User): any {
        const dto = new EventResponseDto();

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

        dto.type = entity.type;

        dto.is_open = entity.is_open;
        dto.is_address_visible = entity.is_address_visible;
        dto.is_userlist_visible = entity.is_userlist_visible;
        dto.is_allowed_to_join_when_in_progress = entity.is_allowed_to_join_when_in_progress;

        dto.joined_status = 'none';

        dto.owner = UserPublicResponseDto.fromEntity(entity.owner);

        if (user) {

            const isOwner: boolean = entity.owner.id === user.id;
            if (isOwner) {
                dto.owner = UserResponseDto.fromEntity(entity.owner);

                dto.users_joined = entity.users_joined?.map((user: User) => UserResponseDto.fromEntity(user));
                dto.users_rejected = entity.users_rejected?.map((user: User) => UserResponseDto.fromEntity(user));
                dto.users_pending = entity.users_pending?.map((user: User) => UserResponseDto.fromEntity(user));
                dto.users_removed = entity.users_removed?.map((user: User) => UserResponseDto.fromEntity(user));

                dto.joined_status = 'owner';
            }

            const isJoined: boolean = entity.users_joined?.map((user: User) => user.id).includes(user.id);
            if (isJoined) {
                dto.owner = UserResponseDto.fromEntity(entity.owner);

                if (entity.is_userlist_visible) {
                    dto.users_joined = entity.users_joined?.map((user: User) => UserResponseDto.fromEntity(user));
                }

                dto.joined_status = 'participant';
            }

            const isPending: boolean = entity.users_pending?.map((user: User) => user.id).includes(user.id);
            if (isPending) {
                if (entity.is_userlist_visible) {
                    dto.users_joined = entity.users_joined?.map((user: User) => UserPublicResponseDto.fromEntity(user));
                }

                dto.joined_status = 'pending';
            }

            const isRejected: boolean = entity.users_rejected?.map((user: User) => user.id).includes(user.id);
            if (isRejected) {
                dto.joined_status = 'rejected';
            }

            const isRemoved: boolean = entity.users_removed?.map((user: User) => user.id).includes(user.id);
            if (isRemoved) {
                dto.joined_status = 'removed';
            }

        }

        return dto;
    }

}
