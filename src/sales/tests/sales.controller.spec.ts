import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import { SalesController } from '../sales.controller';
import { SalesService } from '../sales.service';
import { User } from '../../schemas/user.schema';
import { userStub } from './stubs/user.stub';

const mockService = {
  find: jest.fn().mockReturnThis(),
  bulkInsert: jest.fn().mockReturnThis(),
};

describe('SalesController', () => {
  let controller: SalesController;
  let salesService: SalesService;
  const result: User[] = [userStub()];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
    salesService = module.get<SalesService>(SalesService);
  });

  describe('report', () => {
    it('should return an array of users', async () => {
      const options = {
        fromDate: '2020-10-01',
        endDate: '2021-10-01',
        page: 1,
        pageSize: 10,
      };
      jest
        .spyOn(salesService, 'find')
        .mockImplementation(() => Promise.resolve(result));
      const body = await controller.report(
        options.fromDate,
        options.endDate,
        options.page,
        options.pageSize,
      );
      expect(body).toEqual(result);
    });
  });

  describe('upload csv to /record', () => {
    it('should return acknowledge', async () => {
      const response = true;
      const file: Express.Multer.File = {
        filename: 'test.csv',
        fieldname: 'csv',
        size: 1024,
        destination: '',
        stream: new Readable(),
        buffer: Buffer.from(''),
        originalname: 'test.csv',
        encoding: 'utf8',
        mimetype: 'application/csv',
        path: '/uploads/test.csv',
      };

      jest
        .spyOn(salesService, 'bulkInsert')
        .mockImplementation(() => Promise.resolve(response));

      const body = await controller.record(file);
      expect(body).toEqual({ acknowledge: 'ok', result: response });
    });
  });
});
