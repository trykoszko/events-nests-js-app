import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, ResourceOptions, UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
    constructor(
        private readonly configService: ConfigService
    ) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
            folder: 'events',
            tags: ['events'],
            resource_type: 'image'
        });
    }

    async uploadImage(file: Express.Multer.File, width?: number, height?: number): Promise<UploadApiResponse> {
        const environment = this.configService.get('ENVIRONMENT').toLowerCase();
        const options: UploadApiOptions | ResourceOptions = {
            folder: `events/${environment}`,
            transformation: {
                width: width ? width : 1200,
                height: height ? height : 1200,
                crop: 'fill'
            }
        };

        return await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            });

            toStream(file.buffer).pipe(stream);
        })
            .catch((error: UploadApiErrorResponse) => {
                throw new BadRequestException(
                    'Cloudinary threw an error.',
                    error.message
                );
            }) as UploadApiResponse;
    }

}
