import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBooks } from '../context/BookContext';
import { Category, CATEGORIES, FormErrors } from '../types';
import { RootStackParamList } from '../navigation/types';
import { ROUTES } from '../navigation/routes';
import colors from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.BOOK_FORM>;

export const BookFormScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const editingBook = route.params?.book;
  const isEditing = Boolean(editingBook);

  const { addBook, updateBook } = useBooks();

  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [category, setCategory] = useState<Category>(
    editingBook?.category || 'Giáo trình'
  );
  const [year, setYear] = useState(editingBook ? String(editingBook.year) : '');
  const [quantity, setQuantity] = useState(
    editingBook ? String(editingBook.quantity) : ''
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();

    if (!title.trim()) {
      newErrors.title = 'Tên sách không được để trống';
    }

    if (!author.trim()) {
      newErrors.author = 'Tác giả không được để trống';
    }

    const yearNum = Number(year);
    if (!year.trim() || isNaN(yearNum) || !Number.isInteger(yearNum)) {
      newErrors.year = 'Năm xuất bản phải là số nguyên';
    } else if (yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Năm xuất bản phải từ 1900 đến ${currentYear}`;
    }

    const quantityNum = Number(quantity);
    if (!quantity.trim() || isNaN(quantityNum) || !Number.isInteger(quantityNum)) {
      newErrors.quantity = 'Số lượng phải là số nguyên';
    } else if (quantityNum <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    } else if (isEditing && editingBook && quantityNum < editingBook.borrowed) {
      newErrors.quantity = `Số lượng không được nhỏ hơn số đang mượn (${editingBook.borrowed} cuốn)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      category,
      year: parseInt(year, 10),
      quantity: parseInt(quantity, 10),
      borrowed: editingBook ? editingBook.borrowed : 0,
    };

    if (isEditing && editingBook) {
      updateBook(editingBook.id, bookData);
    } else {
      addBook(bookData);
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: (insets.bottom || 16) + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Tên sách <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Nhập tên sách..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Tác giả <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.author && styles.inputError]}
            placeholder="Nhập tên tác giả..."
            placeholderTextColor={colors.textMuted}
            value={author}
            onChangeText={(text) => {
              setAuthor(text);
              if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
            }}
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Thể loại <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.7}
                  style={[
                    styles.categoryBtn,
                    isSelected && styles.categoryBtnActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      isSelected && styles.categoryBtnTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Năm xuất bản <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.year && styles.inputError]}
            placeholder="Ví dụ: 2024"
            placeholderTextColor={colors.textMuted}
            value={year}
            keyboardType="numeric"
            onChangeText={(text) => {
              setYear(text);
              if (errors.year) setErrors((prev) => ({ ...prev, year: undefined }));
            }}
          />
          {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Tổng số lượng cuốn <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            placeholder="Ví dụ: 10"
            placeholderTextColor={colors.textMuted}
            value={quantity}
            keyboardType="numeric"
            onChangeText={(text) => {
              setQuantity(text);
              if (errors.quantity)
                setErrors((prev) => ({ ...prev, quantity: undefined }));
            }}
          />
          {errors.quantity && (
            <Text style={styles.errorText}>{errors.quantity}</Text>
          )}
          {isEditing && editingBook && (
            <Text style={styles.helperText}>
              Đang có {editingBook.borrowed} cuốn mượn. Số lượng tối thiểu:{' '}
              {editingBook.borrowed}
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.submitBtn}
          onPress={handleSave}
        >
          <Text style={styles.submitBtnText}>
            {isEditing ? 'Lưu Thay Đổi' : 'Thêm Sách'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textTitle,
    marginBottom: 6,
  },
  required: {
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
    marginLeft: 2,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryBtnText: {
    fontSize: 13,
    color: colors.textBody,
  },
  categoryBtnTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});