import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBooks } from '../context/BookContext';
import { Book, CATEGORIES } from '../types';
import { RootStackParamList } from '../navigation/types';
import { ROUTES } from '../navigation/routes';
import colors from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.BOOK_LIST>;

export const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { books, deleteBook } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const totalTitles = books.length;
  const totalBorrowed = books.reduce((sum, b) => sum + b.borrowed, 0);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchCategory =
        selectedCategory === 'Tất cả' || book.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  const renderBookItem = ({ item }: { item: Book }) => {
    const remaining = item.quantity - item.borrowed;
    const isOutOfStock = remaining === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        onPress={() => navigation.navigate(ROUTES.BOOK_DETAIL, { bookId: item.id })}
        onLongPress={() => deleteBook(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.badgeCategory}>
            <Text style={styles.badgeCategoryText}>{item.category}</Text>
          </View>
        </View>

        <Text style={styles.bookAuthor}>Tác giả: {item.author}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.stockText}>
            Còn lại:{' '}
            <Text style={[styles.stockNumber, isOutOfStock && styles.textDanger]}>
              {remaining}/{item.quantity}
            </Text>
          </Text>

          {isOutOfStock ? (
            <View style={styles.badgeOutOfStock}>
              <Text style={styles.badgeOutOfStockText}>Hết sách</Text>
            </View>
          ) : (
            <Text style={styles.borrowedHint}>Đang mượn: {item.borrowed}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 16 }]}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tổng đầu sách</Text>
          <Text style={styles.statValue}>{totalTitles}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Đang được mượn</Text>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {totalBorrowed}
          </Text>
        </View>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên sách hoặc tác giả..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {['Tất cả', ...CATEGORIES].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.7}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy sách phù hợp</Text>
          </View>
        }
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.BOOK_FORM, {})}
      >
        <Text style={styles.fabText}>+ Thêm sách</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  searchSection: {
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textBody,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  bookTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textTitle,
    lineHeight: 22,
  },
  badgeCategory: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCategoryText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  bookAuthor: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  stockText: {
    fontSize: 13,
    color: colors.textBody,
  },
  stockNumber: {
    fontWeight: '700',
    color: colors.success,
  },
  textDanger: {
    color: colors.danger,
  },
  badgeOutOfStock: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOutOfStockText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  borrowedHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  fabText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});