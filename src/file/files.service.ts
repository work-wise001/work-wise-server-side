import { Injectable, Inject } from "@nestjs/common";
//import fs from 'fs';
import * as fs from 'fs';
import { promisify } from 'util';
//import cloudinary from '../utils/cloudinary.config';
//import { v2 as cloudinary } from 'cloudinary';
//import { CloudinaryInterface } from '../cloudinary/cloudinary.types';
import { ConfigService } from '@nestjs/config';
import { getCloudinaryConfig } from '../cloudinary/cloudinary.config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class FileService {
 //constructor(@Inject('CLOUDINARY') private cloudinary: CloudinaryInterface) {}
 private cloudinary;

 constructor(private readonly configService: ConfigService) {
   this.cloudinary = getCloudinaryConfig(this.configService);
 }



    // public async unlinkFile(path: string) {
    //   console.log({path})
    //     await promisify(fs.unlink)(path);
    // }
    public async unlinkFile(path: string) {
      // Promisify the fs.unlink method
      const unlinkAsync = promisify(fs.unlink);
      try {
        await unlinkAsync(path);
        console.log(`Successfully removed ${path}`);
      } catch (error) {
        console.error(`Error removing file: ${error.message}`);
        throw error;
      }
    }

    public async deleteFile(publicId: any) {
        try{
          const deletedFile = await this.cloudinary.uploader.destroy(publicId);
          if(!deletedFile){
            return 'Photo Deletion Failed'
          }
          return 'File deleted Successfully'
        } catch (error) {
          throw new Error(`Error deleting file: ${error}`);
          
        }
    
    }

    public async uploadSinglePhoto(file: Express.Multer.File, dir = 'uploads'): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const { fieldname, size, path } = file;
    
        if (size > 5 * 1024 * 1024) {
          await this.unlinkFile(path);
          throw new Error(`file upload failed, file size is too large, check that the file size is less than 5mb. file: ${fieldname}`);
        }
        const image = await this.cloudinary.uploader.upload(path);
        return image;
      }

}
