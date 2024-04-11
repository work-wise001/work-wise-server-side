import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { productsController } from "./products.controller";
import { ProductService } from "./products.service";
import { productSchema } from "./products.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Product', schema: productSchema }])],
    controllers: [productsController],
    providers: [ProductService],
})

export class productModule {}