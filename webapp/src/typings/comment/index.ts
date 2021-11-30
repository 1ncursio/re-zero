import { User } from '../user';

export interface Comment {
  id?: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: Date;
  updated_at?: Date;
  reply_id?: null;
  user: User;
}
