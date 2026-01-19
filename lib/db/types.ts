export interface UserItem {
  userId: string;
}

export interface Entry extends UserItem {
  title: string;
  amount: number;
  notes?: string;
}
