import { User } from '../../../schemas/user.schema';

export const userStub = (): User => {
  return {
    lastPurchaseDate: new Date('2021-10-16T17:58:51.482Z'),
    saleAmount: 4863373.2,
    gender: 'M',
    height: 175,
    age: 64,
    name: 'Dione Silda',
  };
};
