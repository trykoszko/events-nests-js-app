import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CloudinaryService } from '../cloudinary/services/cloudinary.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_KEY'),
                signOptions: {
                    expiresIn: 3600,
                },
            }),
            inject: [ConfigService],
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService, CloudinaryService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
