import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateInviteDto } from '../dto/create-invite.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invite } from "../entities/invite.entity";
import { EventService } from "../../event/services/event.service";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { InvitePublicResponseDto } from "../dto/invite.public-response.dto";

@Injectable()
export class InviteService {

    constructor(
        @InjectRepository(Invite)
        private inviteRepository: Repository<Invite>,
        private eventService: EventService,
    ) {
    }

    async create(createInviteDto: CreateInviteDto, user: User): Promise<any> {
        const event: Event = await this.eventService.findOne(createInviteDto.event_uuid);

        const invite: Invite = new Invite();
        invite.owner = user;
        invite.event = event;
        invite.message = createInviteDto.message;
        const newInvite: Invite = await this.inviteRepository.save(invite);

        return {
            uuid: newInvite.uuid
        };
    }

    async findOne(uuid: string): Promise<Invite> {
        const invite: Invite = await this.inviteRepository.findOne({
            where: { uuid },
            relations: ['event', 'owner']
        });

        if (!invite) {
            throw new NotFoundException('Invite not found');
        }

        return InvitePublicResponseDto.fromEntity(invite);
    }

}
