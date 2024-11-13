import {Tables} from '@/types/supabase'
export type BookStatus = 'to-read' | 'reading' | 'read' | 'did-not-finish';

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: BookStatus;
  reading_progress: number | null;
  last_position: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: string;
  user_book_id: string;
  status: BookStatus;
  progress: number | null;
  changed_at: string;
  note: string | null;
}

export interface BookStatusDates {
  started_at: string | null;
  finished_at: string | null;
  dnf_at: string | null;
  added_at: string;
}

export type Book = Tables<'books'> & {
  user_book_id: string;
  status: BookStatus;
  reading_progress: number | null;
  last_position: string | null;
  status_history: StatusHistory[];
  status_dates: BookStatusDates;
};

export type ReadingStatus = 'currently-reading' | 'want-to-read' | 'finished' | 'paused';

export type StatusOption = {
  id: ReadingStatus;
  label: string;
  description: string;
  icon: any; // Lucide icon component
  color: string;
  bgColor: string;
  actionLabel: string;
}