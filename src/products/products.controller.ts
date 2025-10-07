import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './schema/products.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { parseExcelFile } from './upload-file.helper';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // @Get()
  // async getAllProducts() {
  //   return this.productsService.getAll();
  // }

  @Post('list')
  async getProducts(
    @Query('page') page: any,
    @Query('size') size: any,
    @Body('brands') brands?: string[],
  ) {
    return this.productsService.getAllByPagination(
      Number(page),
      Number(size),
      brands,
    );
  }

  @Post()
  async addProduct(@Body() product: Products): Promise<Products> {
    return this.productsService.addProduct(product);
  }

  @Get(':id')
  async findProduct(@Param('id') id: string) {
    return this.productsService.findProduct(id);
  }

  @Get(':id')
  async getProductListById(@Param('id') id: string) {
    return this.productsService.findProductAsList(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: Products,
  ): Promise<any> {
    return await this.productsService.updateProduct(id, product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
  }

  @Get()
  async getProductsByBrands(
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('brands') brands?: string | string[],
  ) {
    return this.productsService.getProductsByBrand(
      pageNumber,
      pageSize,
      brands,
    );
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls|csv)$/)) {
          return cb(
            new BadRequestException('Only Excel or CSV files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    // Parse Excel
    const jsonData = parseExcelFile(file.path);

    if (!jsonData.length)
      throw new BadRequestException('Excel file is empty or invalid');

    // ✅ Map Excel columns to Product schema
    const products: Products[] = jsonData.map((row: Products) => ({
      _id: row['_id'],
      name: row['name'] || '',
      brand: row['brand'] || '',
      originalPrice: row['originalPrice'] || 0,
      discountedPrice: row['discountedPrice'] || 0,
      weightValue: row['weightValue'] || 0,
      weightUnit: row['weightUnit'] || '',
      company: row['company'] || '',
      inventoryStatus: row['inventoryStatus'] || 'INSTOCK',
      image: row['image'] || '',
    }));

    // ✅ Save to DB
    const savedProducts: Products[] =
      await this.productsService.upsertProducts(products);

    return {
      message: 'Products uploaded successfully',
      count: savedProducts.length,
    };
  }
}
