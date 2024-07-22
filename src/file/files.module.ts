import { Module } from '@nestjs/common';
import { FileService } from './files.service';
import { ConfigModule } from '@nestjs/config';
//import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
