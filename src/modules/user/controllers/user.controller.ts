import {Body, Controller, Get, Param, Patch, Request, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/guards/jwt-auth.guard';
import {UpdateUserDto} from '../dto/update-user.dto';
import {UserService} from '../services/user.service';
import {apiPath} from "../../../constants";

@Controller(`${apiPath}/user`)
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async get(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':uuid')
    async findOne(@Request() req, @Param('uuid') uuid: string) {
        return await this.userService.findByUuidOrFail(uuid, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        updateUserDto.email = req.user.email;
        return await this.userService.update(updateUserDto);
    }

}
