import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { ROUTES } from './routes';
import colors from '../theme/colors';
import { BookListScreen } from '../screens/BookListScreen';
import { BookFormScreen } from '../screens/BookFormScreen';
import { BookDetailScreen } from '../screens/BookDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerBackTitle: 'Quay lại',
        headerTitleStyle: { fontWeight: '700', color: colors.textTitle },
        headerStyle: { backgroundColor: colors.white },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.BOOK_LIST}
        component={BookListScreen}
        options={{ title: 'Quản Lý Thư Viện' }}
      />
      <Stack.Screen
        name={ROUTES.BOOK_FORM}
        component={BookFormScreen}
        options={({ route }) => ({
          title: route.params?.book ? 'Sửa Sách' : 'Thêm Sách Mới',
        })}
      />
      <Stack.Screen
        name={ROUTES.BOOK_DETAIL}
        component={BookDetailScreen}
        options={{ title: 'Chi Tiết Sách' }}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;