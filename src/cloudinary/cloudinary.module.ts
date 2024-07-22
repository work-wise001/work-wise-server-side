import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Ensure ConfigModule is imported if needed
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
