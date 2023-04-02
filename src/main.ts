import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as express from 'express';
import { join } from 'path';
import helmet from 'helmet';
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter';
import { QueryFailedErrorFilter } from './filters/query-failed-error.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // cors
    app.enableCors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE,OPTION,OPTIONS',
    });

    // helmet
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["*"],
                scriptSrc: ["*"],
                connectSrc: '*',
                styleSrc: ["*"],
                imgSrc: ["*"],
            }
        },
        crossOriginResourcePolicy: {
            policy: 'cross-origin',
        }
    }))

    // pipes
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new EntityNotFoundExceptionFilter());
    app.useGlobalFilters(new QueryFailedErrorFilter());

    // public paths
    app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
    app.use('/assets', express.static(join(__dirname, '..', '..', 'assets')));

    // force https
    if (process.env.NODE_ENV === 'production') {
        app.use((req, res, next) => {
            if (req.header('x-forwarded-proto') !== 'https') {
                res.redirect(`https://${req.header('host')}${req.url}`)
            } else {
                next()
            }
        })
    }

    await app.listen(process.env.PORT || 3000);

    // const server = app.getHttpServer();
    // const router = server._events.request._router;
    //
    // const availableRoutes: [] = router.stack
    //     .map(layer => {
    //         if (layer.route) {
    //             return {
    //                 route: {
    //                     path: layer.route?.path,
    //                     method: layer.route?.stack[0].method,
    //                 },
    //             };
    //         }
    //     })
    //     .filter(item => item !== undefined);
    // console.log('availableRoutes', availableRoutes);
}
bootstrap();
