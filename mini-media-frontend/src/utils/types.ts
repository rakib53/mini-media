export type User = {
  _id: string;
  id?: string;
  username: string;
  email: string;
  phone?: string;
  hobbies?: string[];
  isOnline?: boolean;
};
