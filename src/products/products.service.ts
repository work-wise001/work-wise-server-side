import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./products.model";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProductService {
  private products: Product[] = [];

  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>
  ) {}

  async insertProduct(title: string, description: string, price: number) {
    const productId = uuidv4();
    const newProduct = new this.productModel({ productId, title, description, price });
    const data = await newProduct.save();
    return data;
  }

  async getProducts(query: any) {
    if (!query) {
      const data = await this.productModel.find().exec();
      return data as Product[]
    } else {
      const product = this.findProduct(query);
      return product;
    }
  }

  async updateProduct(query: any, title: string, desc: string, price: number) {
    if (!query) {
      throw new NotFoundException(
        `The Product with the id ${query} no longer exists`
      );
    } else {
      const updatedProduct = await this.findProduct(query);

      if (title) {
        updatedProduct.title = title;
      }
      if (desc) {
        updatedProduct.description = desc;
      }
      if (price) {
        updatedProduct.price = price;
      }

    await updatedProduct.save();
    return updatedProduct;
    }
  }

  async deleteProduct(query: any) {
    const deletedProduct = await this.productModel.deleteOne({ productId: query }).exec();

    return deletedProduct
  }

  private async findProduct(id: string): Promise<Product> {
    const product = await this.productModel.findOne({productId: id})

    if (!product) {
      throw new NotFoundException(`Could Not Find Product with the id ${id}`);
    }
    return  product;
  }
}
