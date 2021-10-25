import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { createReadStream } from 'fs';
import { isEmpty, isInteger, map, parseInt, set } from 'lodash';
import { Model } from 'mongoose';
import { Writable } from 'stream';
import csv = require('csv-parser');
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class SalesService {
  #bulkSize = 100;
  #page = 1;
  #pageSize = 20;
  #headers = [
    'name',
    'age',
    'height',
    'gender',
    'saleAmount',
    'lastPurchaseDate',
  ];

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  #parse(records: User[]): any[] {
    return map(records, (record) => ({
      insertOne: {
        document: { ...record },
      },
    }));
  }

  bulkInsert(file): Promise<boolean> {
    if (!file) {
      throw new BadRequestException({ error: 'Missing csv file!' });
    }
    const bulkSize = this.#bulkSize;
    const parse = this.#parse;
    const userModel = this.userModel;

    let records = [];
    const stream = createReadStream(file, {
      // highWaterMark: 1024,
      autoClose: true,
      encoding: 'utf8',
    });
    stream.pipe(csv(this.#headers)).pipe(
      new Writable({
        objectMode: true,
        async write(json, encoding, callback) {
          const validModel = new userModel(json);
          if (!validModel.validateSync()) {
            records.push(json);
          }
          if (records.length >= bulkSize) {
            await userModel.bulkWrite(parse(records)).catch((error) => error);
            records = [];
          }
          callback();
        },
        async destroy(error, callback) {
          if (records.length > 0) {
            await userModel.bulkWrite(parse(records)).catch((error) => error);
          }
          callback(error);
        },
      }),
    );

    return new Promise<any>(function (resolve, reject) {
      stream
        .on('end', () => {
          // stream.destroy();
          // stream.close();
          resolve(true);
        })
        .on('error', () => {
          reject(false);
        });
    });
  }

  async find(options: any = {}): Promise<User[]> {
    const query = {};
    const { fromDate, endDate } = options;
    const page = isInteger(parseInt(options.page))
      ? parseInt(options.page)
      : this.#page;
    const pageSize = isInteger(parseInt(options.pageSize))
      ? parseInt(options.pageSize)
      : this.#pageSize;
    if (!isEmpty(fromDate) && dayjs(fromDate).isValid()) {
      set(query, 'lastPurchaseDate.$gte', dayjs(fromDate).toISOString());
    }
    if (!isEmpty(endDate) && dayjs(endDate).isValid()) {
      set(query, 'lastPurchaseDate.$lte', dayjs(endDate).toISOString());
    }
    return await this.userModel
      .find(query)
      .sort([['lastPurchaseDate', -1]])
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .exec();
  }
}
