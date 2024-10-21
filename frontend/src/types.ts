export interface Message {
  id: number;
  user: User | null;
  text: string;
}

export interface User {
  id: string;
  name: string;
  isAnonymous?: boolean;
}

export type SendMessageInput = Omit<Message, 'id' | 'user'>;
