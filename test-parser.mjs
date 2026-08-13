import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse function
const MESSAGE_LINE_REGEX = /^\[(\d{1,2})\/(\d{1,2})\/(\d{2}), (\d{1,2}):(\d{2}):(\d{2})(\s(AM|PM))?\]\s+(.+?):\s(.*)$/;

function parseChat(rawText) {
  const lines = rawText.split('\n');
  const messages = [];
  let currentMessage = null;
  let messageIndex = 0;
  const YOUR_NAME = 'Dinesh';

  for (const line of lines) {
    const cleanLine = line.replace(/[‎‏]/g, '').trim();
    if (!cleanLine) continue;

    const match = cleanLine.match(MESSAGE_LINE_REGEX);

    if (match) {
      if (currentMessage && currentMessage.text) {
        messages.push(currentMessage);
      }

      const [, day, month, year, hour, minute, second, , ampm, sender, text] = match;
      const timeStr = ampm
        ? `${day}/${month}/${year} ${hour}:${minute}:${second} ${ampm}`
        : `${day}/${month}/${year} ${hour}:${minute}:${second}`;

      currentMessage = {
        id: `msg-${messageIndex}`,
        timestamp: new Date(timeStr),
        sender: sender.trim(),
        text: text.trim(),
        isSent: sender.trim() === YOUR_NAME,
      };
      messageIndex++;
    } else if (currentMessage) {
      currentMessage.text = (currentMessage.text || '') + '\n' + cleanLine;
    }
  }

  if (currentMessage && currentMessage.text) {
    messages.push(currentMessage);
  }

  return messages.sort((a, b) => a.timestamp - b.timestamp);
}

// Test
const chatPath = path.join(__dirname, 'assets', 'chat.txt');
const rawText = fs.readFileSync(chatPath, 'utf-8');
const messages = parseChat(rawText);

console.log(`✓ Parsed ${messages.length} messages`);
console.log(`\nFirst 5 messages:`);
messages.slice(0, 5).forEach((m, i) => {
  console.log(`  ${i+1}. [${m.timestamp.toLocaleString()}] ${m.sender}: ${m.text.substring(0, 50)}${m.text.length > 50 ? '...' : ''}`);
});

console.log(`\nLast 5 messages:`);
messages.slice(-5).forEach((m, i) => {
  const idx = messages.length - 5 + i + 1;
  console.log(`  ${idx}. [${m.timestamp.toLocaleString()}] ${m.sender}: ${m.text.substring(0, 50)}${m.text.length > 50 ? '...' : ''}`);
});

// Count senders
const senders = new Set();
messages.forEach(m => senders.add(m.sender));
console.log(`\nSenders: ${Array.from(senders).join(', ')}`);

// Count by type
const sentCount = messages.filter(m => m.isSent).length;
console.log(`\nSent by Dinesh: ${sentCount}`);
console.log(`Received from others: ${messages.length - sentCount}`);
