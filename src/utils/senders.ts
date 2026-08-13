import { Message, SenderProfile } from '../types';

const SENDER_COLORS = [
  '#00A884', // WhatsApp green
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#FF6B9D', // Pink
  '#C06C84', // Mauve
  '#6A4C93', // Purple
];

const YOUR_NAME = 'Dinesh';

export function buildSenderProfiles(messages: Message[]): Record<string, SenderProfile> {
  const senderSet = new Set<string>();

  for (const msg of messages) {
    senderSet.add(msg.sender);
  }

  const profiles: Record<string, SenderProfile> = {};
  let colorIndex = 0;

  for (const sender of Array.from(senderSet).sort()) {
    const isYou = sender === YOUR_NAME;
    profiles[sender] = {
      name: sender,
      isYou,
      color: isYou ? '#00A884' : SENDER_COLORS[colorIndex % SENDER_COLORS.length],
    };
    colorIndex++;
  }

  return profiles;
}
