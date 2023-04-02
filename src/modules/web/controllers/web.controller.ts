import { Controller, Get, Request, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from "../../auth/decorators/public.decorator";

@Controller()
export class WebController {

    constructor(
        private configService: ConfigService
    ) {
    }

}
