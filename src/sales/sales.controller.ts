import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { get } from 'lodash';
import { SalesService } from './sales.service';
import { User } from '../interfaces/user.interface';

@Controller('sales')
export class SalesController {

	constructor(private salesService: SalesService) {}

	@Post('record')
	@UseInterceptors(FileInterceptor('csv', { dest: './uploads' }))
	async record(@UploadedFile() file: Express.Multer.File): Promise<boolean> {
		console.log('file', file);
		return this.salesService.bulkInsert(get(file, 'path'));
	}

	@Get('report')
	async report(@Query('from') fromDate: string, @Query('to') endDate: string, @Query('page') page: number, @Query('size') pageSize: number): Promise<User[]> {
		console.log('from', fromDate, 'to', endDate);
		return this.salesService.find({
			fromDate,
			endDate,
			page,
			pageSize
		});
	}
}

