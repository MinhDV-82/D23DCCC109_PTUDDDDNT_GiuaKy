import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBooks } from '../context/BookContext';
import { RootStackParamList } from '../navigation/types';
import { ROUTES } from '../navigation/routes';
import colors from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.BOOK_DETAIL>;

export const BookDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const { bookId } = route.params;
  const { books, borrowBook, returnBook } = useBooks();

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Không tìm thấy thông tin sách!</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const canBorrow = remaining > 0;
  const canReturn = book.borrowed > 0;

  return (
    <View style={[styles.container, { paddingBottom: (insets.bottom || 16) + 12 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.badgeCategory}>
              <Text style={styles.badgeCategoryText}>{book.category}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.editBtn}
              onPress={() => navigation.navigate(ROUTES.BOOK_FORM, { book })}
            >
              <Text style={styles.editBtnText}>Sửa thông tin</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>Tác giả: {book.author}</Text>
          <Text style={styles.year}>Năm xuất bản: {book.year}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Tình trạng sách</Text>

          <View style={styles.statsGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Tổng số lượng</Text>
              <Text style={styles.gridValue}>{book.quantity}</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Đang mượn</Text>
              <Text style={[styles.gridValue, { color: colors.warning }]}>
                {book.borrowed}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Còn lại trong kho</Text>
              <Text
                style={[
                  styles.gridValue,
                  remaining === 0 ? styles.textDanger : styles.textSuccess,
                ]}
              >
                {remaining}
              </Text>
            </View>
          </View>

          {remaining === 0 && (
            <View style={styles.outOfStockBanner}>
              <Text style={styles.outOfStockText}>
                Sách này hiện đã hết trong kho, không thể cho mượn thêm!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!canBorrow}
          style={[
            styles.actionBtn,
            styles.borrowBtn,
            !canBorrow && styles.btnDisabled,
          ]}
          onPress={() => borrowBook(book.id)}
        >
          <Text
            style={[
              styles.actionBtnText,
              !canBorrow && styles.btnTextDisabled,
            ]}
          >
            Cho mượn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!canReturn}
          style={[
            styles.actionBtn,
            styles.returnBtn,
            !canReturn && styles.btnDisabled,
          ]}
          onPress={() => returnBook(book.id)}
        >
          <Text
            style={[
              styles.actionBtnText,
              styles.returnBtnText,
              !canReturn && styles.btnTextDisabled,
            ]}
          >
            Nhận trả
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCategory: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeCategoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.borderLight,
  },
  editBtnText: {
    color: colors.textBody,
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textTitle,
    lineHeight: 28,
  },
  author: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 6,
  },
  year: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textTitle,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridItem: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 6,
    textAlign: 'center',
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textTitle,
  },
  textSuccess: {
    color: colors.success,
  },
  textDanger: {
    color: colors.danger,
  },
  outOfStockBanner: {
    backgroundColor: colors.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
  },
  outOfStockText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  borrowBtn: {
    backgroundColor: colors.primary,
  },
  returnBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  returnBtnText: {
    color: colors.primary,
  },
  btnDisabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#E2E8F0',
    elevation: 0,
    shadowOpacity: 0,
  },
  btnTextDisabled: {
    color: '#94A3B8',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '600',
  },
});