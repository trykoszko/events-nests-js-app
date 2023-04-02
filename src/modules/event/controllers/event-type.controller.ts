import {Controller, Get, UseGuards} from '@nestjs/common';
import {apiPath} from "../../../constants";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {EventTypeService} from "../services/event-type.service";

@Controller(`${apiPath}/event-type`)
export class EventTypeController {

    constructor(private readonly eventTypeService: EventTypeService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.eventTypeService.findAll();
    }

}
