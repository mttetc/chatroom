export interface Message {
  id: number;
  user: User | null;
  text: string;
}

export interface User {
  id: string;
  name: string;
}

export type SendMessageInput = Omit<Message, 'id'>;
