import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform,} from '@nestjs/common';
import {PayloadTooLargeException} from '@nestjs/common/exceptions/payload-too-large.exception';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform<Express.Multer.File> {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
        if (!value?.size) {
            throw new BadRequestException('Could not read size of file.');
        }

        // max file size in bytes
        const maxSize = 10 * 1000 * 1000;

        if (value.size > maxSize) {
            throw new PayloadTooLargeException('Max file size exceeded.');
        }

        return value;
    }
}
