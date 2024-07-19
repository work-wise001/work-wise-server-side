import { Injectable, NotFoundException } from "@nestjs/common";
import fs from 'fs';
import { promisify } from 'util';
import cloudinary from '../utils/cloudinary.config';

@Injectable()
export class FileService {
  //private products: Product[] = [];

//   constructor(
//     //@InjectModel("Product") private readonly productModel: Model<Product>
//   ) {}

    public async unlinkFile(path: string) {
        await promisify(fs.unlink)(path);
    }

    public async deleteFile(publicId: any) {
        try{
          const deletedFile = await cloudinary.uploader.destroy(publicId);
          if(!deletedFile){
            return 'Photo Deletion Failed'
          }
          return 'File deleted Successfully'
        } catch (error) {
          throw new Error(`Error deleting file: ${error}`);
          
        }
    
    }

    public async uploadSinglePhoto(file: Express.Multer.File, dir = 'uploads') {
        const { fieldname, size, path } = file;
    
        if (size > 5 * 1024 * 1024) {
          await this.unlinkFile(path);
          throw new Error(`file upload failed, file size is too large, check that the file size is less than 5mb. file: ${fieldname}`);
        }
        const image = await cloudinary.uploader.upload(path);
        return image;
      }

}
