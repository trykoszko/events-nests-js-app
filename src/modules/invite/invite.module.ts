import {Module} from '@nestjs/common';
import {InviteService} from './services/invite.service';
import {InviteController} from './controllers/invite.controller';
import {UserService} from "../user/services/user.service";
import {EventService} from "../event/services/event.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Event} from "../event/entities/event.entity";
import {User} from "../user/entities/user.entity";
import {Invite} from "./entities/invite.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Event, User, Invite])],
    controllers: [InviteController],
    providers: [InviteService, UserService, EventService]
})
export class InviteModule {
}
