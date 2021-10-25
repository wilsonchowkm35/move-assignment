import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

describe('SalesController', () => {
  let controller: SalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [SalesService],
    }).compile();

    controller = module.get<SalesController>(SalesController);
  });

  describe('report', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          _id: '6175653e90b1156b46491a99',
          lastPurchaseDate: '2021-10-16T17:58:51.482Z',
          saleAmount: 4863373.2,
          gender: 'M',
          height: 175,
          age: 64,
          name: 'Dione Silda',
        },
        {
          _id: '6175653e90b1156b464919ca',
          lastPurchaseDate: '2021-10-16T17:58:51.482Z',
          saleAmount: 4863373.2,
          gender: 'M',
          height: 175,
          age: 64,
          name: 'Dione Silda',
        },
        {
          _id: '61756473878926775f1e9041',
          lastPurchaseDate: '2021-10-16T17:58:51.482Z',
          saleAmount: 4863373.2,
          gender: 'M',
          height: 175,
          age: 64,
          name: 'Dione Silda',
        },
      ];
      jest.spyOn(SalesService, 'report').mockImplementation(() => result);

      expect(await controller.report()).toBe(result);
    });
  });
});
