import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SalesService } from '../sales.service';
import { User } from '../../schemas/user.schema';
import { userStub } from './stubs/user.stub';
import { MockModel } from '../../test/mock.model';

describe('SalesService', () => {
  let service: SalesService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getModelToken(User.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    // userModel = new MockModel();
    service = module.get<SalesService>(SalesService);
    userModel = module.get(getModelToken(User.name));
  });

  describe('Query sales data', () => {
    let users: User[];
    let mockUsers: User[];
    const mockCall: any = {};

    beforeEach(async () => {
      mockUsers = [userStub()];
      mockCall.find = jest.spyOn(userModel, 'find');
      mockCall.sort = jest.spyOn(userModel, 'sort');
      mockCall.limit = jest.spyOn(userModel, 'limit');
      mockCall.skip = jest.spyOn(userModel, 'skip');
      mockCall.exec = jest
        .spyOn(userModel, 'exec')
        .mockResolvedValue(mockUsers as any[]);
      users = await service.find({ page: 2, pageSize: 10 });
    });

    it('Triiger db model to Find sales data', async () => {
      expect(mockCall.find).toBeCalled();
      expect(mockCall.sort).toBeCalled();
      expect(mockCall.limit).toBeCalled();
      expect(mockCall.skip).toBeCalled();
      expect(mockCall.exec).toBeCalled();
      expect(users).toEqual(users);
    });
  });

  describe('Sales data upload', () => {
    const mockCall: any = {};
    let csvFile: string;
    let body: any;

    beforeEach(async () => {
      csvFile = './sales.csv';
      mockCall.bulkWrite = jest.spyOn(userModel, 'bulkWrite');
      body = await service.bulkInsert(csvFile);
    });

    it('Read and insert sales data', async () => {
      expect(body).toBe(true);
    });
  });
});
