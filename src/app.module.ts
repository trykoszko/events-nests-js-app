import {MiddlewareConsumer, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as Joi from '@hapi/joi';
import {DatabaseModule} from "./modules/database/database.module";
import {AuthModule} from "./modules/auth/auth.module";
import {UserModule} from "./modules/user/user.module";
import {AppLoggerMiddleware} from "./middleware/app-logger.middleware";
import {APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import {JwtAuthGuard} from "./modules/auth/guards/jwt-auth.guard";
import {EventModule} from './modules/event/event.module';
import {InviteModule} from './modules/invite/invite.module';
import {MailModule} from './modules/mail/mail.module';
import {ImageModule} from './modules/image/image.module';
import {WebModule} from "./modules/web/web.module";
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                ENVIRONMENT: Joi.string().required(),
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                PORT: Joi.number(),
                MAIL_HOST: Joi.string().required(),
                MAIL_PORT: Joi.string().required(),
                MAIL_USER: Joi.string().required(),
                MAIL_PASSWORD: Joi.string().required(),
                MAIL_FROM: Joi.string().required(),
                APP_URL: Joi.string().required(),
                APP_FRONTEND_URL: Joi.string().required(),
                APP_LANDING_URL: Joi.string().required(),
                CLOUDINARY_CLOUD_NAME: Joi.string().required(),
                CLOUDINARY_API_KEY: Joi.string().required(),
                CLOUDINARY_API_SECRET: Joi.string().required(),
                JWT_KEY: Joi.string().required()
            })
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        EventModule,
        InviteModule,
        MailModule,
        ImageModule,
        WebModule,
        EventEmitterModule.forRoot(),
        CloudinaryModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor
        }
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
