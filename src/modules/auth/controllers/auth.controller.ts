import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { apiPath } from "../../../constants";
import { SocialAuthDto } from "../dto/social-auth.dto";
import { User } from "../../user/entities/user.entity";
import { LoginSuccessResponseDto } from "../dto/login-success.response-dto";
import { AuthDto } from "../dto/auth.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { UpdatePasswordDto } from "../dto/update-password.dto";
import { FileSizeValidationPipe } from '../../event/pipes/file-size-validation.pipe';
import { ImageFileValidationPipe } from '../../event/pipes/image-file-validation.pipe';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(`${apiPath}/auth`)
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService
    ) {
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() authDto: AuthDto): Promise<LoginSuccessResponseDto> {
        return this.authService.login(authDto);
    }

    @Public()
    @Post('social-auth')
    async socialAuth(@Body() socialAuthDto: SocialAuthDto): Promise<LoginSuccessResponseDto> {
        return this.authService.socialAuth(socialAuthDto);
    }

    @Public()
    @Post('register')
    @UseInterceptors(FileInterceptor('avatar'))
    async register(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile(new FileSizeValidationPipe(), new ImageFileValidationPipe()) file?: Express.Multer.File
    ): Promise<User> {
        if (file) {
            const fileCloudinaryUrl: UploadApiResponse = await this.cloudinaryService.uploadImage(file, 200, 200);
            createUserDto.avatar_url = fileCloudinaryUrl.secure_url;
        }

        return this.authService.register(createUserDto);
    }

    @Public()
    @Get('confirm-registration/:registrationToken')
    @HttpCode(HttpStatus.OK)
    async confirmRegister(@Param('registrationToken') registrationToken: string): Promise<void> {
        return await this.authService.confirmRegister(registrationToken);
    }

    @Public()
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        return await this.authService.forgotPassword(forgotPasswordDto);
    }

    @Public()
    @Post('update-password')
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
        return await this.authService.updatePassword(updatePasswordDto);
    }

}
