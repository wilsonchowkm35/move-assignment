import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { get } from 'lodash';
import { SalesService } from './sales.service';
// import { User } from '../interfaces/user.interface';
import { User } from '../schemas/user.schema';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post('record')
  @UseInterceptors(FileInterceptor('csv', { dest: './uploads' }))
  async record(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const result = await this.salesService.bulkInsert(get(file, 'path'));
    return { acknowledge: 'ok', result };
  }

  @Get('report')
  async report(
    @Query('from') fromDate: string,
    @Query('to') endDate: string,
    @Query('page') page: number,
    @Query('size') pageSize: number,
  ): Promise<User[]> {
    return this.salesService.find({
      fromDate,
      endDate,
      page,
      pageSize,
    });
  }
}
