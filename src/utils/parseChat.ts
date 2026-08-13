import { Message, MessageType } from '../types';
import { parse, format } from 'date-fns';

const YOUR_NAME = 'Dinesh';

// Regex: [DD/MM/YY, HH:MM:SS AM/PM] Sender: Text
const MESSAGE_LINE_REGEX = /^\[(\d{1,2})\/(\d{1,2})\/(\d{2}), (\d{1,2}):(\d{2}):(\d{2})(\s(AM|PM))?\]\s+(.+?):\s(.*)$/;

export function parseChat(rawText: string): Message[] {
  const lines = rawText.split('\n');
  const messages: Message[] = [];
  let currentMessage: Partial<Message> | null = null;
  let messageIndex = 0;

  for (const line of lines) {
    // Strip zero-width characters
    const cleanLine = line.replace(/[‎‏]/g, '').trim();

    if (!cleanLine) continue;

    const match = cleanLine.match(MESSAGE_LINE_REGEX);

    if (match) {
      // Save previous message if exists
      if (currentMessage && currentMessage.text) {
        messages.push(finalizeMessage(currentMessage, messageIndex++));
      }

      const [, day, month, year, hour, minute, second, , ampm, sender, text] = match;

      // Parse time with AM/PM awareness
      let timeStr = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
      if (ampm) timeStr += ` ${ampm}`;

      let timestamp: Date;
      try {
        // Always use 12-hour format since WhatsApp exports include AM/PM
        timestamp = parse(timeStr, 'dd/MM/yy h:mm:ss a', new Date());
        if (isNaN(timestamp.getTime())) throw new Error('Invalid date');
      } catch (e) {
        console.warn(`Failed to parse timestamp: ${timeStr}`);
        continue;
      }

      currentMessage = {
        id: `msg-${messageIndex}`,
        timestamp,
        sender: sender.trim(),
        text: text.trim(),
        type: 'text' as MessageType,
        isSent: sender.trim() === YOUR_NAME,
      };

      // Detect message type
      detectMessageType(currentMessage);
    } else if (currentMessage) {
      // Multi-line message continuation
      currentMessage.text = (currentMessage.text || '') + '\n' + cleanLine;
    }
  }

  // Save last message
  if (currentMessage && currentMessage.text) {
    messages.push(finalizeMessage(currentMessage, messageIndex));
  }

  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

function detectMessageType(msg: Partial<Message>): void {
  const text = (msg.text || '').trim();

  if (text === 'Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them.' ||
      text === 'Messages and calls are end-to-end encrypted') {
    msg.type = 'system';
  } else if (text.includes('You deleted this message') || text === 'This message was deleted') {
    msg.type = 'deleted';
  } else if (text.includes('<This message was edited>')) {
    msg.type = 'edited';
    msg.text = text.replace(/\s*<This message was edited>$/, '');
  } else if (text.includes('<attached:')) {
    // Skip media for this phase
    msg.type = 'text';
  } else if (text.includes('Location:')) {
    // Skip location links
    msg.type = 'text';
  } else if (isEmojiOnly(text)) {
    msg.type = 'emoji';
  }
}

function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim();
  // Check if text contains only emojis and spaces
  // Simple heuristic: count word chars - if minimal, likely emoji-only
  const wordChars = trimmed.replace(/[\p{Emoji}\p{Emoji_Component}\p{Emoji_Modifier}\s]/gu, '');
  return wordChars.length === 0 && trimmed.length <= 20 && trimmed.length > 0;
}

function finalizeMessage(msg: Partial<Message>, index: number): Message {
  return {
    id: msg.id || `msg-${index}`,
    timestamp: msg.timestamp || new Date(),
    sender: msg.sender || 'Unknown',
    text: (msg.text || '').trim(),
    type: msg.type || 'text',
    isSent: msg.isSent || false,
  };
}
