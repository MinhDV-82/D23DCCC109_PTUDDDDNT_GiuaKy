import { Book } from '../types';


export const initialBooks: Book[] = [
  {
    id: '1',
    title: 'Lập trình Di động với React Native',
    author: 'Nguyễn Văn A',
    category: 'Giáo trình',
    year: 2023,
    quantity: 10,
    borrowed: 3
  },
  {
    id: '2',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 2018,
    quantity: 5,
    borrowed: 5,
  },
  {
    id: '3',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2020,
    quantity: 8,
    borrowed: 2,
  },
  {
    id: '4',
    title: 'Số Đỏ',
    author: 'Vũ Trọng Phụng',
    category: 'Tiểu thuyết',
    year: 2015,
    quantity: 6,
    borrowed: 0,
  },
  {
    id: '5',
    title: 'Cấu Trúc Dữ Liệu và Giải Thuật',
    author: 'Trần Đình B',
    category: 'Giáo trình',
    year: 2021,
    quantity: 4,
    borrowed: 1,
  },
];