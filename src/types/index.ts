
export const CATEGORIES = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Book {
  id: string;         
  title: string;       
  author: string;     
  category: Category;  
  year: number;        
  quantity: number;   
  borrowed: number;    
}

export type BookFormData = Omit<Book, 'id'>;


export interface FormErrors {
  title?: string;
  author?: string;
  year?: string;
  quantity?: string;
}