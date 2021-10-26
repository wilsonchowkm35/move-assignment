import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesModule } from '../../sales/sales.module';

describe('User sales records', () => {
  let app: INestApplication;
  const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
  const testDataFile = path.resolve('./scripts/test/data/sales.csv');

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath }),
        SalesModule,
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: `mongodb://${process.env.DB_USER}:${encodeURIComponent(
              process.env.DB_PASS,
            )}@${process.env.DB_HOST}:${process.env.DB_PORT || 27017}/${
              process.env.DB_NAME
            }?authSource=admin`,
          }),
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/sales/report', async () => {
    return request(app.getHttpServer())
      .get('/sales/report')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('/sales/record', async () => {
    return await request(app.getHttpServer())
      .post('/sales/record')
      .attach('csv', testDataFile)
      .expect(201)
      .expect({
        acknowledge: 'ok',
        result: true,
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
