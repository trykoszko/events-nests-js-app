import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform,} from '@nestjs/common';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform<Express.Multer.File> {
    private imageMimeTypes = ['image/jpg', 'image/png', 'image/jpeg'];

    transform(value: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
        if (!value?.mimetype) {
            throw new BadRequestException('Could not read MIME type of file.');
        }

        if (!this.imageMimeTypes.includes(value.mimetype)) {
            throw new BadRequestException(`File must be one of the following types: ${this.imageMimeTypes.join(', ')}`);
        }

        return value;
    }
}
