import { Controller, Post, Body, Get, Query, Patch, Delete } from "@nestjs/common";

import { ProductService } from "./products.service";

@Controller("products")
export class productsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  addProduct(
    @Body("title") prodTitle: string,
    @Body("description") prodDesc: string,
    @Body("price") prodPrice: number
  ) {
    const data = this.productService.insertProduct(
      prodTitle,
      prodDesc,
      prodPrice
    );
    return data;
  }

  @Get()
  getProducts(@Query("productId") prodId: string) {
    const data = this.productService.getProducts(prodId);
    return data;
  }

  @Patch()
  updateProduct(
    @Query("productId") prodId: any,
    @Body("title") prodTitle: string,
    @Body("description") prodDesc: string,
    @Body("price") prodPrice: number
  ) {
    const data = this.productService.updateProduct(
      prodId,
      prodTitle,
      prodDesc,
      prodPrice
    );
    return data;
  }

  @Delete()
  deleteProduct(@Query("productId") prodId: any) {
    const data = this.productService.deleteProduct(prodId);
    return data;
  }

}
