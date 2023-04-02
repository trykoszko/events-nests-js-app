import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Event } from '../event/entities/event.entity';
import { UserEventsService } from './services/user-events.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Event])],
    controllers: [UserController],
    providers: [UserService, UserEventsService],
    exports: [UserService, UserEventsService]
})
export class UserModule {
}
