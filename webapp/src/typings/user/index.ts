export interface User {
  id: string;
  email: string | null;
  name: string;
  image_url: string | null;
  google_id: string;
  created_at: Date;
  updated_at: Date;
  email_verified_at: Date | null;
}
