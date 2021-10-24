import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import * as mongoose from 'mongoose';
// import { User } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop()
	name: string;

	@Prop()
	age: number;

	@Prop()
	height: number;

	@Prop()
	gender: string;

	@Prop()
	saleAmount: number;

	@Prop()
	lastPurchaseDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
