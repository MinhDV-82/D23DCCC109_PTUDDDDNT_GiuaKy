import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookFormData } from '../types';
import { initialBooks } from '../data/initialBooks';

const STORAGE_KEY = '@library_books';

interface BookContextType {
  books: Book[];
  addBook: (data: BookFormData) => void;
  updateBook: (id: string, data: BookFormData) => void;
  deleteBook: (id: string) => void;
  borrowBook: (id: string) => void;
  returnBook: (id: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBooks(JSON.parse(stored));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
        setBooks(initialBooks);
      }
    } catch {
      setBooks(initialBooks);
    }
  };

  const saveBooks = async (newBooks: Book[]) => {
    setBooks(newBooks);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
    } catch {}
  };

  const addBook = (data: BookFormData) => {
    const newBook: Book = {
      ...data,
      id: Date.now().toString(),
      borrowed: 0,
    };
    saveBooks([newBook, ...books]);
  };

  const updateBook = (id: string, data: BookFormData) => {
    const updated = books.map((b) => (b.id === id ? { ...b, ...data } : b));
    saveBooks(updated);
  };

  const deleteBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;

    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn được mượn. Không thể xoá!`
      );
      return;
    }

    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá cuốn sách "${book.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            saveBooks(books.filter((b) => b.id !== id));
          },
        },
      ]
    );
  };

  const borrowBook = (id: string) => {
    const updated = books.map((b) => {
      if (b.id === id && b.quantity - b.borrowed > 0) {
        return { ...b, borrowed: b.borrowed + 1 };
      }
      return b;
    });
    saveBooks(updated);
  };

  const returnBook = (id: string) => {
    const updated = books.map((b) => {
      if (b.id === id && b.borrowed > 0) {
        return { ...b, borrowed: b.borrowed - 1 };
      }
      return b;
    });
    saveBooks(updated);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};