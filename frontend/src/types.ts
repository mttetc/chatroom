export interface Message {
  id: number;
  user: string;
  text: string;
}

export interface User {
  id: string;
  name: string;
}

export type SendMessageInput = Omit<Message, 'id'>;
