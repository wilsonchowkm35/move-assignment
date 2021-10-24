import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createReadStream } from 'fs';
import { get, map } from 'lodash';
import { Model } from 'mongoose';
import csv = require('csv-parser');
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class SalesService {

	// private readonly users: User[] = [];

	#bulkSize: number = 100;

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
		const bulkSize = this.#bulkSize;
		const userModel = this.userModel;
		let records = [];
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

				records.push(data);

				if (records.length > bulkSize) {
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

	async find(fromDate?: String, endDate?: String): Promise<User[]> {
		return this.userModel.find().exec();
	}
}
