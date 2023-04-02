import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThan, Not, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { FilterOperator, paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { UserService } from "../../user/services/user.service";
import { User } from "../../user/entities/user.entity";
import { EventResponseDto } from "../dto/event.response.dto";
import * as dayjs from 'dayjs';
import { EventPublicResponseDto } from '../dto/event.public-response.dto';

@Injectable()
export class EventService {

    private twoWeeksAgo: Date;
    private twoMonthsAgo: Date;

    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        private userService: UserService
    ) {
        this.twoWeeksAgo = dayjs().subtract(14, 'day').toDate();
        this.twoMonthsAgo = dayjs().subtract(2, 'month').toDate();
    }

    async findAll(query: PaginateQuery, user: User): Promise<Paginated<Event>> {
        const userRelatedEvents: Event[] = [
            ...user.events_owned,
            ...user.events_joined,
            ...user.events_pending,
            ...user.events_rejected,
            ...user.events_removed
        ];

        const paginateQuery: Paginated<Event> = await paginate(query, this.eventRepository, {
            relations: [
                'type',
                'owner',
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ],
            sortableColumns: ['id', 'title', 'date_time', 'created_at'],
            nullSort: 'last',
            searchableColumns: ['title'],
            defaultSortBy: [['created_at', 'DESC']],
            filterableColumns: {
                location_city: [FilterOperator.EQ],
                location_country: [FilterOperator.EQ],
                'type.title': [FilterOperator.EQ],
                'type.slug': [FilterOperator.EQ],
                is_open: [FilterOperator.EQ],
                date_time: [FilterOperator.GT, FilterOperator.GTE, FilterOperator.LT, FilterOperator.LTE]
            },
            where: {
                id: Not(In(userRelatedEvents.map(event => event.id))),
            },
            withDeleted: false,
        });

        paginateQuery.data = paginateQuery.data.map((event: Event) => EventResponseDto.fromEntity(event, user));

        return paginateQuery;
    }

    async findOne(uuid: string, user?: User): Promise<Event> {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: {
                uuid
            },
            relations: [
                'type',
                'owner',
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ],
        });

        return EventResponseDto.fromEntity(event, user);
    }

    async findOnePublic(uuid: string): Promise<EventPublicResponseDto> {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: {
                uuid
            },
            relations: [
                'type',
                'owner',
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ],
        });

        return EventPublicResponseDto.fromEntity(event);
    }

    async findOwned(user: User): Promise<Event[]> {
        const events: Event[] = await this.eventRepository.find({
            relations: [
                'owner',
                'type',
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ],
            where: {
                date_time: MoreThan(this.twoMonthsAgo),
                owner: {
                    id: user.id
                }
            },
            order: {
                date_time: 'DESC'
            }
        });

        return events.map((event: Event) => EventResponseDto.fromEntity(event, user));
    }

    async findRejected(user: User): Promise<Event[]> {
        const events: Event[] = await this.eventRepository.find({
            relations: ['users_rejected'],
            where: {
                users_rejected: {
                    uuid: user.uuid
                },
                date_time: MoreThan(this.twoWeeksAgo)
            },
            relationLoadStrategy: 'query',
            order: {
                date_time: 'DESC'
            },
            take: 5
        });

        return events.map((event: Event) => EventResponseDto.fromEntity(event, user));
    }

    async findJoined(user: User): Promise<Event[]> {
        const events: Event[] = await this.eventRepository.find({
            relations: ['type', 'users_joined', 'owner'],
            where: {
                users_joined: {
                    uuid: user.uuid
                },
                date_time: MoreThan(this.twoMonthsAgo)
            },
            relationLoadStrategy: 'query',
            order: {
                date_time: 'DESC'
            }
        });

        return events.map((event: Event) => EventResponseDto.fromEntity(event, user));
    }

    async findPending(user: User): Promise<Event[]> {
        const events: Event[] = await this.eventRepository.find({
            relations: ['type', 'users_pending', 'owner'],
            where: {
                users_pending: {
                    uuid: user.uuid
                },
                date_time: MoreThan(this.twoMonthsAgo)
            },
            relationLoadStrategy: 'query',
            order: {
                date_time: 'DESC'
            }
        });

        return events.map((event: Event) => EventResponseDto.fromEntity(event, user));
    }

    async findRemoved(user: User): Promise<Event[]> {
        const events: Event[] = await this.eventRepository.find({
            relations: ['type', 'users_removed', 'owner'],
            where: {
                users_removed: {
                    uuid: user.uuid
                },
                date_time: MoreThan(this.twoMonthsAgo)
            },
            relationLoadStrategy: 'query',
            order: {
                date_time: 'DESC'
            }
        });

        return events.map((event: Event) => EventResponseDto.fromEntity(event, user));
    }

    async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
        if (user.events_owned.length) {
            const lastEventAddedTime: Date = user.events_owned[0].created_at;

            const oneHourAgo = Date.now() - (1000 * 60 * 60);
            const eventDate = (new Date(lastEventAddedTime)).valueOf();

            if (eventDate <= oneHourAgo) {
                throw new ConflictException('Minimal interval between adding events is 1 hour.');
            }
        }

        const event: Event = new Event();
        for (const [key, value] of Object.entries(createEventDto)) {
            event[key] = value;
        }

        event.owner = user;

        return this.eventRepository.save(event);
    }

    async update(uuid: string, updateEventDto: UpdateEventDto, user: User): Promise<Event> {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: { uuid },
            relations: ['owner']
        });

        if (event.owner.id !== user.id) {
            throw new UnauthorizedException('You\'re not the owner of this event.');
        }

        const eventToUpdate: Event = this.eventRepository.create({
            ...event
        });

        for (const [key, value] of Object.entries(updateEventDto)) {
            eventToUpdate[key] = value;
        }

        eventToUpdate.setSlug();

        return this.eventRepository.save(eventToUpdate);
    }

    async delete(uuid: string, user: User): Promise<Event> {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: { uuid },
            relations: ['owner']
        });

        if (event.owner.id !== user.id) {
            throw new UnauthorizedException('You\'re not the owner of this event.');
        }

        return this.eventRepository.remove(event);
    }

    async join(user: User, uuid: string) {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: { uuid },
            relations: [
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ]
        });

        if (event.owner.id === user.id) {
            throw new BadRequestException('You can\'t join this event as owner.');
        }

        if (event.slots - event.users_joined.length <= 0) {
            throw new BadRequestException('This event has no more empty slots.');
        }

        if (event.users_rejected.find((participant: User) => participant.id === user.id)) {
            throw new ConflictException('This users join request was rejected by event host.');
        }

        if (event.users_removed.find((participant: User) => participant.id === user.id)) {
            throw new ConflictException('This user was removed from event by event host.');
        }
    

        if (event.is_open) {
            if (event.users_joined.find((participant: User) => participant.id === user.id)) {
                throw new ConflictException('This user is already a participant of this event.');
            }
    
            event.users_joined = event.users_joined.concat([user]);

            return await this.eventRepository.save(event);
        }

        if (event.users_pending.find((participant: User) => participant.id === user.id)) {
            throw new ConflictException('You already sent a join request to this event.');
        }

        event.users_pending.push(user);

        return await this.eventRepository.save(event);
    }

    async leave(user: User, uuid: string) {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: { uuid },
            relations: [
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ]
        });

        if (event.users_rejected.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This users join request was rejected by event host.');
        }

        if (event.users_removed.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was removed from event by event host.');
        }

        if (event.is_open) {
            if (!event.users_joined.find((participant: User) => participant.id === user.id)) {
                throw new BadRequestException('This user is already not a participant of this event.');
            }

            event.users_joined = event.users_joined.filter((participant: User) => participant.id !== user.id);

            return await this.eventRepository.save(event);
        }

        if (!event.users_pending.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user is already not a pending participant of this event.');
        }

        return await this.eventRepository.save(event);
    }

    async acceptJoinRequest(currentUser: User, eventUuid: string, userUuid: string) {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: {
                uuid: eventUuid
            },
            relations: [
                'owner',
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ]
        });
        const user: User = await this.userService.findOneByOrFail({uuid: userUuid});

        if (event.owner.uuid !== currentUser.uuid) {
            throw new UnauthorizedException('You can not accept requests for this event.');
        }

        if (!event.users_pending.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user is not a pending participant of this event.');
        }

        if (event.users_rejected.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was already rejected by host.');
        }

        if (event.users_removed.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was already removed by host.');
        }

        if (event.users_joined.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was already approved by host.');
        }

        event.users_pending = event.users_pending.filter((participant: User) => participant.id !== user.id);

        await this.eventRepository.save(event);

        event.users_joined.push(user);

        return await this.eventRepository.save(event);
    }

    async rejectJoinRequest(currentUser: User, eventUuid: string, userUuid: string) {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: {
                uuid: eventUuid
            },
            relations: [
                'owner',
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ]
        });
        const user: User = await this.userService.findOneByOrFail({uuid: userUuid});

        if (event.owner.uuid !== currentUser.uuid) {
            throw new UnauthorizedException('You can not accept requests for this event.');
        }

        if (!event.users_pending.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user is not a pending participant of this event.');
        }

        if (event.users_rejected.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was already rejected by host.');
        }

        if (event.users_removed.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was removed by host.');
        }

        if (event.users_joined.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user is already a participant.');
        }

        event.users_pending = event.users_pending.filter((participant: User) => participant.id !== user.id);

        await this.eventRepository.save(event);

        event.users_rejected.push(user);

        return await this.eventRepository.save(event);
    }

    async cancelJoinRequest(user: User, uuid: string) {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: { uuid },
            relations: [
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ]
        });

        if (event.users_rejected.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This users join request was rejected by event host.');
        }

        if (event.users_removed.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was removed from event by event host.');
        }

        if (!event.users_pending.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user is already not a pending participant of this event.');
        }

        event.users_pending = event.users_pending.filter((participant: User) => participant.id !== user.id);

        return await this.eventRepository.save(event);
    }

    async removeUser(currentUser: User, eventUuid: string, userUuid: string) {
        const event: Event = await this.eventRepository.findOneOrFail({
            where: {
                uuid: eventUuid
            },
            relations: [
                'owner',
                'users_joined',
                'users_pending',
                'users_rejected',
                'users_removed'
            ]
        });
        const user: User = await this.userService.findOneByOrFail({uuid: userUuid});

        if (event.owner.uuid !== currentUser.uuid) {
            throw new UnauthorizedException('You can not remove users from this event.');
        }


        if (event.users_pending.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user is still pending to join.');
        }

        if (event.users_rejected.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was already rejected by host.');
        }

        if (!event.users_joined.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user is not a participant.');
        }

        if (event.users_removed.find((participant: User) => participant.id === user.id)) {
            throw new BadRequestException('This user was already removed by host.');
        }

        event.users_joined = event.users_joined.filter((participant: User) => participant.id !== user.id);

        await this.eventRepository.save(event);

        event.users_removed.push(user);

        return await this.eventRepository.save(event);
    }

}
