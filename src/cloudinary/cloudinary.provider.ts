// import { v2 as cloudinary } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';

// export const CloudinaryProvider = {
//   provide: 'Cloudinary',
//   useFactory: (configService: ConfigService) => {
//     cloudinary.config({
//       cloud_name: configService.get('CLOUDINARY_NAME'),
//       api_key: configService.get('CLOUDINARY_API_KEY'),
//       api_secret: configService.get('CLOUDINARY_SECRET_KEY'),
//     });
//     console.log('Cloudinary configuration set: ', cloudinary.config());
//     return cloudinary;
//   },
//   inject: [ConfigService],
// };
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryInterface } from './cloudinary.types';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService): CloudinaryInterface => {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_SECRET_KEY'),
    });
    //console.log('Cloudinary configuration set: ', cloudinary.config());
    return cloudinary as CloudinaryInterface;
  },
  inject: [ConfigService],
};
