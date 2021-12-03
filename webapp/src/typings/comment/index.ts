import { User } from '../user';

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: Date;
  updated_at?: Date;
  reply_id: number | null;
  user: User;
  likes: User[];
  reply_count: number;

  // custom fields for the frontend
  isLiked: boolean;
  isMine: boolean;
}
