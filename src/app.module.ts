import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { ConfigModule } from '@nestjs/config'; // for env
///////////////------ Modules Used In Project -----////////////
import { productModule } from "./products/products.module";
import { authModule } from "./users/auth.module";

@Module({
  imports: [productModule, authModule, ConfigModule.forRoot({isGlobal: true, envFilePath: '.env',}), MongooseModule.forRoot(process.env.MONGODB_URL)],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
