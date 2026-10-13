import { Message, MessageGroup } from '../types';
import { formatDateSeparator } from './dateFormatter';

const GROUP_TIME_WINDOW_MS = 60 * 1000; // 60 seconds

export function groupMessages(messages: Message[]): MessageGroup[] {
  if (!messages.length) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: Message[] = [];
  let currentSender = '';
  let lastTimestamp = new Date(0);
  let lastDisplayedDate: Date | null = null;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prevMsg = messages[i - 1];

    // Check if we need to insert a date separator
    if (lastDisplayedDate && !isSameDay(lastDisplayedDate, msg.timestamp)) {
      // Push current group if exists
      if (currentGroup.length > 0) {
        // Sort messages within group by timestamp (oldest first, since data is newest-first)
        const sortedGroup = currentGroup.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        groups.push({
          id: `group-${groups.length}`,
          messages: sortedGroup,
          sender: currentSender,
          isGroupStart: true,
        });
        currentGroup = [];
      }

      // Add date separator
      const separatorText = formatDateSeparator(msg.timestamp);
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

    // Update last displayed date
    if (!lastDisplayedDate || !isSameDay(lastDisplayedDate, msg.timestamp)) {
      lastDisplayedDate = msg.timestamp;
    }

    // Check if same sender and within time window
    // parseChat returns newest-first, so compare elapsed time in either order.
    const timeDiff = Math.abs(msg.timestamp.getTime() - lastTimestamp.getTime());
    const isSameSender = msg.sender === currentSender;
    const isWithinTimeWindow = timeDiff <= GROUP_TIME_WINDOW_MS;

    if (isSameSender && isWithinTimeWindow && currentGroup.length > 0) {
      // Add to current group
      currentGroup.push(msg);
    } else {
      // Save current group and start new one
      if (currentGroup.length > 0) {
        // Sort messages within group by timestamp (oldest first, since data is newest-first)
        const sortedGroup = currentGroup.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        groups.push({
          id: `group-${groups.length}`,
          messages: sortedGroup,
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
    // Sort messages within group by timestamp (oldest first, since data is newest-first)
    const sortedGroup = currentGroup.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    groups.push({
      id: `group-${groups.length}`,
      messages: sortedGroup,
      sender: currentSender,
      isGroupStart: true,
    });
  }

  console.log(`Created ${groups.length} message groups, ${groups.filter(g => g.sender === 'SYSTEM').length} are date separators`);
  return groups;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
