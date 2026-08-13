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
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  senderProfile,
  showSenderName = false,
}: MessageBubbleProps) {
  // Handle date separators (system messages with "Today", "Yesterday", etc.)
  if (message.sender === 'SYSTEM' && (message.text === 'Today' || message.text === 'Yesterday' || message.text.match(/\d{1,2} \w+ \d{4}/))) {
    return <DateSeparator text={message.text} />;
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
    />
  );
});
