export interface IAIHistory {
  id: number;
  black_id: number;
  white_id: null;
  status: 'black_win' | 'white_win' | 'draw';
  record: string | null;
  play_time: number | null;
  created_at: Date;
  updated_at: Date;
}
