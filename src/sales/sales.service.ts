import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { createReadStream } from 'fs';
import { get, isEmpty, isInteger, map, parseInt, set } from 'lodash';
import { Model } from 'mongoose';
import csv = require('csv-parser');
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class SalesService {

	#bulkSize: number = 100;

	#page: number = 1;
	#pageSize: number = 20;

	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	#parse(records: any[]) {
		return map(records, record => ({
			insertOne: {
				document: { ...record }
			}
		}));
	}

	bulkInsert(file): Promise<boolean> {
		if (!file) {
			throw new Error('Missing csv file!');
		}
		const that = this;
		const userModel = this.userModel;
		let records = [];
		let counter = 0;
		return new Promise<any>(function(resolve, reject) {
			const stream = createReadStream(file, { 
				highWaterMark: 1024,
				autoClose: true,
				encoding: 'utf8'
			});
			stream
			.pipe(csv(['name', 'age', 'height', 'gender', 'saleAmount', 'lastPurchaseDate']))
			.on('data', async function(data) {
				stream.pause();

				if (counter > 0) {
					records.push(data);
				}
				counter++;

				if (records.length > that.#bulkSize) {
					await userModel.bulkWrite(that.#parse(records));
					records = [];
				}
				
				stream.resume();
			})
			.on('end', async () => {
				console.log('stream closed!');
				if (records.length > 0) {
					await userModel.bulkWrite(that.#parse(records));
				}
				stream.destroy();
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
		const page = isInteger(parseInt(options.page)) ? parseInt(options.page) : this.#page;
		const pageSize = isInteger(parseInt(options.pageSize)) ? parseInt(options.pageSize) : this.#pageSize;
		if (!isEmpty(fromDate) && dayjs(fromDate).isValid()) {
			set(query, { 
				lastPurchaseDate: { 
					$gte: dayjs(fromDate).utc().format()
				}
			});
		}
		if (!isEmpty(endDate) && dayjs(endDate).isValid()) {
			set(query, {
				lastPurchaseDate: {
					$lte: dayjs(endDate).utc().format()
				}
			});
		}
		console.log(query, page, pageSize, options);
		return await this.userModel.find(query).limit(pageSize).skip((page - 1) * pageSize).exec();
	}
}
