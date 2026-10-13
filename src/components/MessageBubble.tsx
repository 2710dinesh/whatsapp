import React from 'react';
import { Message, SenderProfile } from '../types';
import { TextBubble } from './TextBubble';
import { SystemMessage } from './SystemMessage';
import { EmojiMessage } from './EmojiMessage';
import { DateSeparator } from './DateSeparator';

interface MessageBubbleProps {
  message: Message;
  senderProfile?: SenderProfile;
  showSenderName?: boolean;
  searchQuery?: string;
  isCurrentResult?: boolean;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  senderProfile,
  showSenderName = false,
  searchQuery = '',
  isCurrentResult = false,
}: MessageBubbleProps) {
  // Hide date separators - they'll be shown in sticky header instead
  if (message.sender === 'SYSTEM') {
    return null;
  }

  // Handle other system messages
  if (message.type === 'system') {
    return <SystemMessage message={message} />;
  }

  // Handle emoji-only messages
  if (message.type === 'emoji') {
    return <EmojiMessage message={message} />;
  }

  // Handle text and deleted messages
  return (
    <TextBubble
      message={message}
      senderName={senderProfile?.name}
      senderColor={senderProfile?.color}
      showSenderName={showSenderName}
      searchQuery={searchQuery}
      isCurrentResult={isCurrentResult}
    />
  );
});
