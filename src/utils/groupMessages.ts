import { Message, MessageGroup } from '../types';
import { formatDateSeparator } from './dateFormatter';

const GROUP_TIME_WINDOW_MS = 60 * 1000; // 60 seconds

export function groupMessages(messages: Message[]): MessageGroup[] {
  if (!messages.length) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: Message[] = [];
  let currentSender = '';
  let lastTimestamp = new Date(0);

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prevMsg = messages[i - 1];

    // Check if we need to insert a date separator
    if (prevMsg && !isSameDay(prevMsg.timestamp, msg.timestamp)) {
      // Push current group if exists
      if (currentGroup.length > 0) {
        groups.push({
          id: `group-${groups.length}`,
          messages: currentGroup,
          sender: currentSender,
          isGroupStart: true,
        });
        currentGroup = [];
      }

      // Add date separator as a pseudo-group
      const separatorText = formatDateSeparator(msg.timestamp, prevMsg.timestamp);
      if (separatorText) {
        groups.push({
          id: `date-${msg.timestamp.getTime()}`,
          messages: [
            {
              id: `date-msg-${msg.timestamp.getTime()}`,
              timestamp: msg.timestamp,
              sender: 'SYSTEM',
              text: separatorText,
              type: 'system',
              isSent: false,
            },
          ],
          sender: 'SYSTEM',
          isGroupStart: true,
        });
      }
    }

    // Check if same sender and within time window
    const timeDiff = msg.timestamp.getTime() - lastTimestamp.getTime();
    const isSameSender = msg.sender === currentSender;
    const isWithinTimeWindow = timeDiff <= GROUP_TIME_WINDOW_MS;

    if (isSameSender && isWithinTimeWindow && currentGroup.length > 0) {
      // Add to current group
      currentGroup.push(msg);
    } else {
      // Save current group and start new one
      if (currentGroup.length > 0) {
        groups.push({
          id: `group-${groups.length}`,
          messages: currentGroup,
          sender: currentSender,
          isGroupStart: true,
        });
      }

      currentGroup = [msg];
      currentSender = msg.sender;
    }

    lastTimestamp = msg.timestamp;
  }

  // Push final group
  if (currentGroup.length > 0) {
    groups.push({
      id: `group-${groups.length}`,
      messages: currentGroup,
      sender: currentSender,
      isGroupStart: true,
    });
  }

  return groups;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
