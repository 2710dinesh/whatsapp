export type MediaType = 'image' | 'video' | 'audio' | 'sticker' | 'gif' | 'document';
export type MessageType = 'text' | 'system' | 'deleted' | 'emoji' | 'edited';

export interface Message {
  id: string;
  timestamp: Date;
  sender: string;
  text: string;
  type: MessageType;
  isSent: boolean;
  edited?: boolean;
}

export interface SenderProfile {
  name: string;
  isYou: boolean;
  color: string;
}

export interface MessageGroup {
  id: string;
  messages: Message[];
  sender: string;
  isGroupStart: boolean;
  estimatedHeight?: number;
}
