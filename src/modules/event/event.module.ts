import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "./entities/event.entity";
import { EventType } from "./entities/event-type.entity";
import { EventTypeController } from "./controllers/event-type.controller";
import { EventTypeService } from "./services/event-type.service";
import { UserService } from "../user/services/user.service";
import { ConfigService } from "@nestjs/config";
import { CloudinaryService } from '../cloudinary/services/cloudinary.service';

@Module({
    imports: [TypeOrmModule.forFeature([Event, User, EventType])],
    controllers: [EventController, EventTypeController],
    providers: [EventService, EventTypeService, UserService, ConfigService, CloudinaryService],
    exports: [EventService]
})
export class EventModule {
}
