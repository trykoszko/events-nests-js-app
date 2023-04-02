import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as crypto from "crypto";
import { UserResponseDto } from "../dto/user.response.dto";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';
import { RelationColumn } from 'nestjs-paginate/lib/helper';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private eventEmitter: EventEmitter2
    ) {
    }

    async loadRelations(user: User, relations: RelationColumn<User>[]): Promise<User> {
        return this.userRepository.findOne({
            where: {
                uuid: user.uuid
            },
            relations
        });
    }

    async findOneOrFail(email: string): Promise<User> {
        const user: User = await this.userRepository.findOne({
            where: { email },
            relations: [
                'events_owned',
                'events_joined',
                'events_pending',
                'events_rejected',
                'events_removed'
            ]
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByUuidOrFail(uuid: string, currentUser?: User): Promise<User | UserResponseDto> {
        if (!currentUser) {
            throw new NotFoundException('User not found');
        }

        const user: User = await this.userRepository.findOneByOrFail({ uuid });

        return UserResponseDto.fromEntity(user);
    }

    async findOneByOrFail(findBy: any): Promise<User> {
        const user: User = await this.userRepository.findOneBy(findBy);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    async findOneBy(findBy: any): Promise<User> {
        return await this.userRepository.findOneBy(findBy);
    }

    async findOne(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email });
    }

    async findByConfirmationToken(token: string): Promise<User> {
        const user: User = await this.userRepository.findOneBy({
            confirmation_token: token
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    async getCredentials(email: string): Promise<User> {
        const user: User = await this.userRepository.findOne({
            where: {
                email: email
            },
            select: ['email', 'password']
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.email = createUserDto.email.toLowerCase().replace(/ /g, '');

        const existingUser: User = await this.userRepository.findOneBy({ email: createUserDto.email });
        if (existingUser) {
            if (!createUserDto.facebook_user_id) {
                throw new ConflictException('User with given email already exists');
            }
        }

        const user = new User()

        for (const [key, value] of Object.entries(createUserDto)) {
            user[key] = value
        }

        user.terms_accepted = true;
        user.permissions = 1;

        user.is_active = !!createUserDto.facebook_user_id;

        if (!createUserDto.facebook_user_id) {
            user.confirmation_token = crypto.randomBytes(20).toString('hex');
        }

        const createdUser: User = await this.userRepository.save(user);

        this.eventEmitter.emit(
            'user.created',
            new UserCreatedEvent(
                user.first_name,
                user.email,
                user.confirmation_token
            )
        );

        return createdUser;
    }

    async update(updateUserDto: UpdateUserDto): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ email: updateUserDto.email });

        for (const [key, value] of Object.entries(updateUserDto)) {
            user[key] = value
        }

        return await this.userRepository.save(user);
    }

    async generatePasswordResetToken(email: string): Promise<User> {
        const user: User = await this.findOneOrFail(email);

        user.password_reset_token = crypto.randomBytes(20).toString('hex');
        await this.userRepository.save(user);

        return user;
    }

}
