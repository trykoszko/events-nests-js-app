import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { apiPath } from "../../../constants";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Event } from "../entities/event.entity";
import { Paginate, Paginated, PaginateQuery } from "nestjs-paginate";
import { FileSizeValidationPipe } from "../pipes/file-size-validation.pipe";
import { ImageFileValidationPipe } from "../pipes/image-file-validation.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { Public } from '../../auth/decorators/public.decorator';

const path = `${apiPath}/event`;
const publicPath = `${apiPath}/public/event`

@Controller()
export class EventController {

    constructor(
        private readonly eventService: EventService,
        private cloudinaryService: CloudinaryService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post(path)
    @UseInterceptors(FileInterceptor('background_image'))
    async create(
        @Request() req,
        @Body() createEventDto: CreateEventDto,
        @UploadedFile(new FileSizeValidationPipe(), new ImageFileValidationPipe()) file?: Express.Multer.File
    ): Promise<Event> {
        if (file) {
            const fileCloudinaryUrl: UploadApiResponse = await this.cloudinaryService.uploadImage(file);
            createEventDto.background_image_url = fileCloudinaryUrl.secure_url;
        }

        return await this.eventService.create(createEventDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(path)
    async findAll(@Request() req, @Paginate() query: PaginateQuery): Promise<Paginated<Event>> {
        return this.eventService.findAll(query, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${path}/owned`)
    async findOwned(@Request() req): Promise<Event[]> {
        return this.eventService.findOwned(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${path}/joined`)
    async findJoined(@Request() req): Promise<Event[]> {
        return this.eventService.findJoined(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${path}/rejected`)
    async findRejected(@Request() req): Promise<Event[]> {
        return this.eventService.findRejected(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${path}/pending`)
    async findPending(@Request() req): Promise<Event[]> {
        return this.eventService.findPending(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${path}/:uuid`)
    async findOne(@Request() req, @Param('uuid') uuid: string) {
        return this.eventService.findOne(uuid, req.user);
    }

    @Public()
    @Get(`${publicPath}/:uuid`)
    async findOnePublic(@Param('uuid') uuid: string) {
        return this.eventService.findOnePublic(uuid);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(`${path}/:uuid`)
    async update(@Request() req, @Param('uuid') uuid: string, @Body() updateEventDto: UpdateEventDto) {
        return this.eventService.update(uuid, updateEventDto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(`${path}/:uuid`)
    async delete(@Request() req, @Param('uuid') uuid: string) {
        return this.eventService.delete(uuid, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(`${path}/:uuid/join`)
    async join(@Request() req, @Param('uuid') uuid: string) {
        return this.eventService.join(req.user, uuid);
    }

    @UseGuards(JwtAuthGuard)
    @Post(`${path}/:uuid/leave`)
    async leave(@Request() req, @Param('uuid') uuid: string) {
        return this.eventService.leave(req.user, uuid);
    }

    @UseGuards(JwtAuthGuard)
    @Post(`${path}/:uuid/accept-request/:userUuid`)
    async acceptJoinRequest(
        @Request() req,
        @Param('uuid') uuid: string,
        @Param('userUuid') userUuid: string
    ) {
        return this.eventService.acceptJoinRequest(req.user, uuid, userUuid);
    }

    @UseGuards(JwtAuthGuard)
    @Post(`${path}/:uuid/reject-request/:userUuid`)
    async rejectJoinRequest(
        @Request() req,
        @Param('uuid') uuid: string,
        @Param('userUuid') userUuid: string
    ) {
        return this.eventService.rejectJoinRequest(req.user, uuid, userUuid);
    }

    @UseGuards(JwtAuthGuard)
    @Post(`${path}/:uuid/remove-user/:userUuid`)
    async removeUser(
        @Request() req,
        @Param('uuid') uuid: string,
        @Param('userUuid') userUuid: string
    ) {
        return this.eventService.removeUser(req.user, uuid, userUuid);
    }

    @UseGuards(JwtAuthGuard)
    @Post(`${path}/:uuid/cancel-request`)
    async cancelJoinRequest(@Request() req, @Param('uuid') uuid: string) {
        return this.eventService.cancelJoinRequest(req.user, uuid);
    }

}
