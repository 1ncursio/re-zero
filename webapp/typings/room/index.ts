import { User } from '../user';

export interface Room {
  id: number;
  uuid: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  users: User[];
  is_started: boolean;
  password: string | null;
}
