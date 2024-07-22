import { Module, NestModule, MiddlewareConsumer, RequestMethod  } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { ConfigModule } from '@nestjs/config'; // for env
///////////////------ Modules Used In Project -----////////////
import { productModule } from "./products/products.module";
import { authModule } from "./users/auth.module";
import { CloudinaryModule } from './cloudinary/cloudinary.module';
//import { AuthMiddleware } from './users/auth.middleware';

@Module({
  imports: [productModule, authModule, ConfigModule.forRoot({isGlobal: true, envFilePath: '.env',}), 
    //CloudinaryModule, 
    MongooseModule.forRoot(process.env.MONGODB_URL)],
  controllers: [AppController],
  providers: [],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .exclude(
//         { path: 'login', method: RequestMethod.POST },
//         { path: 'users', method: RequestMethod.POST }  // Exclude this route from the middleware
//       )
//       .forRoutes('*'); // or specify certain route paths or controllers
//   }
// }
export class AppModule {}
