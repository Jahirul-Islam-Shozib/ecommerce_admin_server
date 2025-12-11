import { ProductsService } from './products.service';

describe('ProductsService', () => {
  const createService = () => {
    const query = {
      sort: jest.fn(),
      skip: jest.fn(),
      limit: jest.fn(),
      exec: jest.fn().mockResolvedValue([]),
    };
    query.sort.mockReturnValue(query);
    query.skip.mockReturnValue(query);
    query.limit.mockReturnValue(query);

    const countQuery = {
      exec: jest.fn().mockResolvedValue(0),
    };
    const productModel = {
      find: jest.fn().mockReturnValue(query),
      countDocuments: jest.fn().mockReturnValue(countQuery),
    };

    return {
      productModel,
      service: new ProductsService(productModel as never),
    };
  };

  it('searches all text fields using a case-insensitive literal keyword', async () => {
    const { productModel, service } = createService();

    await service.getAllByPagination(1, 10, undefined, undefined, ' Milk.* ');

    const filter = productModel.find.mock.calls[0][0];
    expect(filter.$or).toHaveLength(7);
    expect(
      filter.$or.map((condition: object) => Object.keys(condition)[0]),
    ).toEqual([
      '_id',
      'name',
      'brand',
      'company',
      'category',
      'weightUnit',
      'inventoryStatus',
    ]);
    expect(filter.$or[1].name).toEqual(/Milk\.\*/i);
    expect(productModel.countDocuments).toHaveBeenCalledWith(filter);
  });

  it('combines filters and searches numeric product fields', async () => {
    const { productModel, service } = createService();

    await service.getAllByPagination(1, 20, ['Acme'], ['Beverages'], '500');

    const filter = productModel.find.mock.calls[0][0];
    expect(filter.brand).toEqual({ $in: ['Acme'] });
    expect(filter.category).toEqual({ $in: ['Beverages'] });
    expect(filter.$or).toEqual(
      expect.arrayContaining([
        { originalPrice: 500 },
        { discountedPrice: 500 },
        { weightValue: 500 },
      ]),
    );
  });
});
