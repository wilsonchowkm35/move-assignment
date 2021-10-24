import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesController } from './sales/sales.controller';
import { SalesService } from './sales/sales.service';
import { SalesModule } from './sales/sales.module';

const envFilePath: string = `.env.${process.env.MODE || 'development'}`;

@Module({
  imports: [
		ConfigModule.forRoot({ envFilePath }),
		MongooseModule.forRootAsync({
			useFactory: () => ({
				uri: `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.PORT || 27017 }/${process.env.DB_NAME}?authSource=admin`
			})
		}),
		SalesModule
	],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
