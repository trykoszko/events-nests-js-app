import {Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {WebController} from "./controllers/web.controller";

@Module({
    imports: [ConfigModule],
    controllers: [WebController],
})
export class WebModule {
}
