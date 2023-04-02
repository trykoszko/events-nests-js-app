import {Body, Controller, Delete, Get, Param, Post, Request, UseGuards} from '@nestjs/common';
import {InviteService} from '../services/invite.service';
import {apiPath} from "../../../constants";
import {Public} from "../../auth/decorators/public.decorator";
import {Invite} from "../entities/invite.entity";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CreateInviteDto} from "../dto/create-invite.dto";

@Controller()
export class InviteController {
    constructor(
        private readonly inviteService: InviteService
    ) {
    }

    @Public()
    @Get(`${apiPath}/public/invite/:uuid`)
    async findOne(@Param('uuid') uuid: string): Promise<Invite> {
        return await this.inviteService.findOne(uuid);
    }

    @UseGuards(JwtAuthGuard)
    @Post(`${apiPath}/invite`)
    async create(@Request() req, @Body() createInviteDto: CreateInviteDto): Promise<any> {
        return await this.inviteService.create(createInviteDto, req.user);
    }

}
