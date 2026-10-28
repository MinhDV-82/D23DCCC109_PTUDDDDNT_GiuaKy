import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Book } from '../types';
import { ROUTES } from './routes';

export type RootStackParamList = {
  [ROUTES.BOOK_LIST]: undefined;
  [ROUTES.BOOK_FORM]: { book?: Book };
  [ROUTES.BOOK_DETAIL]: { bookId: string };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
