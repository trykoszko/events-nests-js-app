import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../user/services/user.service'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../../user/dto/create-user.dto'
import * as bcrypt from 'bcryptjs'
import { SocialAuthDto } from "../dto/social-auth.dto";
import { User } from "../../user/entities/user.entity";
import { LoginSuccessResponseDto } from "../dto/login-success.response-dto";
import { AuthDto } from "../dto/auth.dto";
import { UpdateUserDto } from "../../user/dto/update-user.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { UpdatePasswordDto } from "../dto/update-password.dto";
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UserPasswordResetEvent } from '../../user/events/user-password-reset.event'

const salt = bcrypt.genSaltSync()

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private eventEmitter: EventEmitter2
    ) {
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.getCredentials(email);
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new UnauthorizedException('You provided an incorrect password.');
        }

        return user;
    }

    async login(authDto: AuthDto): Promise<LoginSuccessResponseDto> {
        const user: User = await this.userService.findOne(authDto.email);
        if (!user.is_active) {
            throw new UnauthorizedException('User is not active yet. Confirm registration via e-mail to be able to log in.')
        }

        const payload = { email: authDto.email, password: authDto.password };
        const token = this.jwtService.sign(payload);

        return {
            success: true,
            access_token: token,
        }
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.create(createUserDto);
    }

    async socialAuth(socialAuthDto: SocialAuthDto): Promise<LoginSuccessResponseDto> {
        let user: User;

        if (!socialAuthDto.email) {
            throw new UnauthorizedException();
        }

        const existingUser: User = await this.userService.findOneBy({
            email: socialAuthDto.email,
            facebook_user_id: socialAuthDto.id
        });

        if (existingUser) {

            // update all user data on each social login
            const updateUserDto: UpdateUserDto = new UpdateUserDto();
            updateUserDto.facebook_user_id = socialAuthDto.id;
            updateUserDto.email = socialAuthDto.email;
            updateUserDto.first_name = socialAuthDto.first_name;
            updateUserDto.last_name = socialAuthDto.last_name;
            updateUserDto.social_url_facebook = socialAuthDto.link;
            updateUserDto.avatar_url = socialAuthDto.image_url;
            user = await this.userService.update(updateUserDto);

        } else {

            const createUserDto: CreateUserDto = new CreateUserDto();
            createUserDto.facebook_user_id = socialAuthDto.id;
            createUserDto.email = socialAuthDto.email;
            createUserDto.password = `${socialAuthDto.id}_${socialAuthDto.email}`;
            createUserDto.first_name = socialAuthDto.first_name;
            createUserDto.last_name = socialAuthDto.last_name;
            createUserDto.social_url_facebook = socialAuthDto.link;
            createUserDto.avatar_url = socialAuthDto.image_url;
            user = await this.userService.create(createUserDto);

        }

        const token = this.jwtService.sign({
            email: user.email,
            password: user.password
        });

        return {
            success: true,
            access_token: token,
        }
    }

    async confirmRegister(registrationToken: string): Promise<void> {
        const user: User = await this.userService.findByConfirmationToken(registrationToken);

        if (user.is_active) {
            throw new ConflictException('User already confirmed.');
        }

        const updateUserDto: UpdateUserDto = {
            email: user.email,
            is_active: true,
            confirmation_token: null
        }

        if (!await this.userService.update(updateUserDto)) {
            throw new BadRequestException('Something went wrong. Please try again later.');
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const user: User = await this.userService.generatePasswordResetToken(forgotPasswordDto.email);

        this.eventEmitter.emit(
            'user.password-reset',
            new UserPasswordResetEvent(
                user.first_name,
                user.email,
                user.password_reset_token
            )
        );
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<void> {
        const user: User = await this.userService.findOneByOrFail({
            password_reset_token: updatePasswordDto.password_reset_token
        });

        if (updatePasswordDto.password_reset_token !== user.password_reset_token) {
            throw new BadRequestException('Wrong password reset token.');
        }

        const updateUserDto: UpdateUserDto = {
            email: user.email,
            password: updatePasswordDto.password
        }

        if (!await this.userService.update(updateUserDto)) {
            throw new BadRequestException();
        }
    }

}
