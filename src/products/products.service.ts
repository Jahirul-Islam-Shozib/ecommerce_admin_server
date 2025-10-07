import { Injectable } from '@nestjs/common';
import { Products, ProductsDocument } from './schema/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private productModel: Model<ProductsDocument>,
  ) {}

  // async getAll(): Promise<Products[]> {
  //   return this.productModel.find().exec();
  // }

  async getAllByPagination(
    pageNumber: number,
    pageSize: number,
    brands?: string | string[],
  ): Promise<{ data: Products[]; total: number }> {
    const skip = (pageNumber - 1) * pageSize;

    const filter: FilterQuery<ProductsDocument> = {};

    if (Array.isArray(brands) && brands.length > 0) {
      // Example brands = ['Ruchi', 'Radhuni']
      // Will match documents where product.brand is exactly one of these
      filter.brand = { $in: brands };
    }
    const [data, total] = await Promise.all([
      this.productModel.find(filter).skip(skip).limit(pageSize).exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async addProduct(product: Products): Promise<Products> {
    const newProducts = new this.productModel(product);
    return await newProducts.save();
  }

  async findProduct(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async findProductAsList(id: string) {
    const product = await this.productModel.findOne({ _id: id }).exec();

    return {
      data: product ? [product] : [],
      total: product ? 1 : 0,
    };
  }

  async updateProduct(id: string, products: Products) {
    return this.productModel.findByIdAndUpdate(id, products, {
      new: true,
    });
  }

  async deleteProduct(id: string) {
    await this.productModel.findByIdAndDelete(id);
  }

  async getProductsByBrand(
    pageNumber: number,
    pageSize: number,
    brands?: string | string[],
  ): Promise<{ data: Products[]; total: number }> {
    const skip = (pageNumber - 1) * pageSize;

    // Normalize brands into array
    const brandArray = Array.isArray(brands) ? brands : brands ? [brands] : [];

    // Build MongoDB filter
    const filter: Record<string, any> = {};
    if (brandArray.length) {
      filter.brand = { $in: brandArray };
    }

    // Fetch data and total count in parallel
    const [data, total] = await Promise.all([
      this.productModel.find(filter).skip(skip).limit(pageSize).exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async upsertProducts(products: Products[]): Promise<Products[]> {
    const results: Products[] = [];

    for (const product of products) {
      if (product._id) {
        // Update existing by id
        const updated = await this.productModel
          .findByIdAndUpdate(
            product._id,
            product,
            { new: true, upsert: true }, // upsert: creates if not exists
          )
          .exec();
        results.push(updated);
      } else {
        // Create new if no id
        const newProduct = new this.productModel(product);
        const saved = await newProduct.save();
        results.push(saved);
      }
    }

    return results;
  }
}
