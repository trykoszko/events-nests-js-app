import {
    Controller,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Res,
    Response,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { apiPath } from "../../../constants";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { diskStorage } from "multer";
import { editFileName } from "../helpers/edit-file-name";
import { imageFileFilter } from "../helpers/image-file-filter";
import * as fs from "fs";
import * as path from "path";

@Controller(`${apiPath}/image`)
export class ImageController {

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: 'uploads/',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    uploadFile(
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 20000 }),
            ],
        })) file: Express.Multer.File,
    ) {
        return file;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':imageName')
    getFile(@Res() res: Response, @Param('imageName') imageName: string): StreamableFile {
        const file = fs.createReadStream(path.join(process.cwd(), `/uploads/${imageName}`));
        return new StreamableFile(file);
    }

}