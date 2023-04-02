import {Global, Module} from '@nestjs/common';
import {ImageController} from "./controllers/image.controller";

@Global()
@Module({
    controllers: [ImageController],
})
export class ImageModule {
}
