import { User } from '../user';

export interface Post {
  id: number;
  title: string;
  views: number;
  content: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  user: User;
}
