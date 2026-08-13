# 📱 PRD: Chat Memories App
### A React Native mobile app to relive WhatsApp conversations
> **v2.0** — Updated with full media support (1GB media folder + 500KB chat.txt)

---

## 1. Overview

**Product Name:** Memories (working title)
**Platform:** React Native (iOS + Android)
**Purpose:** Parse an exported WhatsApp `.txt` chat file and render it as a pixel-perfect, immersive WhatsApp-like chat experience — preserved forever as a personal keepsake.

---

## 2. Goals

- Parse a WhatsApp exported chat `.txt` file stored in the project root
- Render messages in an authentic WhatsApp-style mobile UI
- **Render real media** — photos, videos, voice notes, stickers from the exported media folder
- Feel indistinguishable from the real WhatsApp app
- Be a self-contained, offline app — no backend, no login
- Be emotionally warm and personal, not clinical

---

## 3. File Input

### 3.1 Chat Text File (500KB)
- The exported WhatsApp `.txt` file is placed in `assets/chat.txt`
- The app reads this file at startup (bundled as a local asset via `require()` or `expo-asset`)
- No file picker needed — hardcoded for this one chat
- Format of WhatsApp export (standard):
  ```
  [DD/MM/YYYY, HH:MM:SS] Name: Message text
  [DD/MM/YYYY, HH:MM:SS] Name: IMG-20260812-WA0023.jpg (file attached)
  [DD/MM/YYYY, HH:MM:SS] Name: PTT-20260812-WA0024.opus (file attached)
  ```
  Example:
  ```
  [12/08/2026, 11:34:02] Dinesh: hey good morning ☀️
  [12/08/2026, 11:34:45] Dia ❤️❤️: good morning 🥰
  [12/08/2026, 11:35:10] Dia ❤️❤️: IMG-20260812-WA0023.jpg (file attached)
  [12/08/2026, 11:36:00] Dinesh: PTT-20260812-WA0024.opus (file attached)
  ```

### 3.2 Media Folder (~1GB)
- All media files are placed in `assets/media/` folder
- WhatsApp names files predictably: `IMG-YYYYMMDD-WANNNNN.jpg`, `PTT-YYYYMMDD-WANNNNN.opus`, `VID-YYYYMMDD-WANNNNN.mp4`, etc.
- The parser extracts the filename from the text line and maps it to the corresponding file in `assets/media/`
- Files that exist → rendered as real media bubbles
- Files that don't exist (missing) → rendered as placeholder bubble gracefully

### 3.3 Asset Bundling Strategy
- 1GB of media is too large to bundle into the app binary via `require()` — Expo has a bundle size limit
- **Solution:** Use `expo-file-system` + copy media to the device's document directory on first launch
- On first run: copy all files from `assets/media/` → `FileSystem.documentDirectory + 'media/'`
- Show a one-time "Setting up your memories..." progress screen during this copy
- On subsequent launches: files already exist, skip copy, load instantly
- Reference media via `FileSystem.documentDirectory` URI at runtime

---

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo managed workflow) |
| Language | TypeScript |
| Navigation | React Navigation v6 |
| Storage | `expo-file-system` (media file access) |
| Styling | StyleSheet API (no Tailwind — RN native) |
| Icons | `@expo/vector-icons` (MaterialIcons / Ionicons) |
| Date parsing | `date-fns` |
| List rendering | `FlatList` with `inverted` prop |
| Image viewing | `expo-image` (fast, cached) + `react-native-image-viewing` (fullscreen) |
| Video playback | `expo-av` (`Video` component) |
| Audio playback | `expo-av` (`Audio` component) |
| File system | `expo-file-system` (copy + read media) |
| Progress (first launch) | `expo-progress` or custom progress bar |

---

## 5. Screens & Navigation

### 5.1 First Launch Setup Screen (one-time only)
- Shown **only on the very first app launch**
- WhatsApp-style green background (`#075E54`)
- Heart emoji or lock icon centered
- Text: "Setting up your memories..."
- Progress bar showing media copy progress (e.g., "Copying 847 files...")
- After copy completes → auto-navigates to Chat Screen, never shows again

### 5.2 Splash / Loading Screen
- WhatsApp-style green background (`#075E54`)
- White WhatsApp logo centered
- "Loading memories..." subtle text
- Shown on every launch while `.txt` is parsed (fast, < 1 second)

### 5.3 Chat Screen (Main Screen)
This is the heart of the app. Everything happens here.

### 5.4 Media Viewer Screen
- Full-screen image viewer (pinch to zoom, swipe to dismiss)
- Triggered by tapping any photo bubble
- Black background, image centered
- Top-left: close (X) button
- Bottom: timestamp of the message

### 5.5 Video Player Screen
- Full-screen video player
- Standard play/pause/seek controls
- Triggered by tapping any video bubble

---

## 6. Chat Screen — Detailed Spec

### 6.1 Status Bar
- Dark content, matches header color
- Background: `#075E54` (WhatsApp dark green)

### 6.2 Header / App Bar
Exact replica of WhatsApp chat header:

| Element | Detail |
|---|---|
| Back arrow | Left side, white, chevron icon |
| Avatar | Circular, 40px, auto-generated from name initials (colored background) |
| Name | Bold, white, 16sp — her name (parsed from chat) |
| Status | "tap here for contact info" — grey, 12sp (static) |
| Video call icon | White, top right |
| Phone icon | White, top right |
| Three-dot menu | White, top right |

Header background: `#075E54`

### 6.3 Chat Wallpaper / Background
- Default WhatsApp wallpaper feel: very light grey-beige `#ECE5DD` with subtle tiled pattern (optional — can use flat color for simplicity)
- Slight texture gives authentic feel

### 6.4 Date Separators
- Appear between messages when the date changes
- Pill-shaped chip: white/light background, centered
- Text: `Today`, `Yesterday`, or `DD MMM YYYY` (e.g., `12 Aug 2026`)
- Font: 12sp, grey `#667781`
- Example: `─────  12 Aug 2026  ─────`

### 6.5 Message Bubbles

**Sent messages (Dinesh — right side):**
| Property | Value |
|---|---|
| Background | `#DCF8C6` (WhatsApp green bubble) |
| Alignment | Right, 8px right margin |
| Border radius | 8px, with top-right corner = 0 (WhatsApp tail shape) |
| Max width | 75% of screen width |
| Text color | `#111B21` |
| Font size | 14.5sp |
| Padding | 6px 8px |
| Tail | Small green triangle top-right |

**Received messages (Dia — left side):**
| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Alignment | Left, 8px left margin |
| Border radius | 8px, with top-left corner = 0 |
| Max width | 75% of screen width |
| Sender name | Bold, colored (e.g., `#00A884`), shown above message text |
| Text color | `#111B21` |
| Font size | 14.5sp |
| Padding | 6px 8px |
| Tail | Small white triangle top-left |

**Timestamp (inside every bubble, bottom-right):**
- Format: `11:34 AM`
- Font: 11sp, grey `#667781`
- Aligned to bottom-right of bubble
- For sent messages: show double tick `✓✓` in blue (`#4FC3F7`) — static, always shown as "read"

### 6.6 Special Message Types

**System/event messages** (e.g., "Messages and calls are end-to-end encrypted"):
- Centered pill chip
- Light yellow background `#FFF9C4`
- 12sp grey text
- No bubble tail

**Media messages — with real files:**

| File type | Extensions | Render behaviour |
|---|---|---|
| Photo | `.jpg`, `.png`, `.webp` | Inline image thumbnail (max 260×260px), tap → full-screen viewer |
| Sticker | `.webp` (small, no caption) | Inline, no bubble background, 160×160px |
| Video | `.mp4`, `.mov` | Thumbnail with ▶ play button overlay + duration badge, tap → full-screen player |
| Voice note | `.opus`, `.ogg`, `.m4a` | Audio player bubble: mic icon + waveform bars + play/pause + duration |
| GIF | `.gif` | Auto-plays inline, looped, no sound |
| Document | `.pdf` | Doc icon + filename + file size label |

**Media messages — missing files (`<Media omitted>`):**
- Show a grey placeholder with appropriate icon (📷 / 🎵 / 📄) + "Media not available" label
- Same bubble size and styling, just no real content

**Deleted messages** (`This message was deleted`):
- Italic text, grey `#667781`
- Shown with a ⊘ icon inside the bubble

**Missed call / call events:**
- Phone icon + "Missed voice call" or "Voice call · X min" text
- Inside a centered chip or bubble depending on type

**Emoji-only messages:**
- If message is only 1-3 emojis, render them at 36sp (large emoji style, no bubble background)

**Long messages:**
- No truncation — show full text, bubble expands naturally

### 6.7 FlatList Behavior
- `FlatList` with messages
- Start at **bottom** (most recent) on load — `initialScrollIndex` to last item or use `inverted` prop
- Smooth scroll
- `getItemLayout` for performance on large chats
- Group consecutive messages from same sender within 60 seconds — remove repeated avatar/name

### 6.8 Bottom Input Bar (Static / Non-functional)
Replica of WhatsApp input bar — purely decorative, no typing functionality needed:

| Element | Detail |
|---|---|
| Background | `#F0F2F5` |
| Emoji icon | Left side, grey |
| Text field | Rounded, white, placeholder "Message" |
| Attachment icon | Inside field, right |
| Camera icon | Inside field, right |
| Mic button | Green circle `#00A884`, right side, mic icon |

This is static — no keyboard, no input. Just visual authenticity.

---

## 7. Chat Parsing Logic

### 7.1 Parser Input
- Raw text from `chat.txt` (bundled asset)
- Handles both 12-hour and 24-hour time formats
- Handles multi-line messages (continuation lines with no timestamp prefix)

### 7.2 Parser Output (TypeScript interface)
```typescript
type MediaType = 'image' | 'video' | 'audio' | 'sticker' | 'gif' | 'document';

interface Message {
  id: string;                  // unique id (index)
  timestamp: Date;             // parsed date + time
  sender: string;              // "Dinesh" or "Dia ❤️❤️"
  text: string;                // message content (caption or text)
  type: 'text' | 'media' | 'deleted' | 'system' | 'call';
  isSent: boolean;             // true if sender === YOUR_NAME
  // Media-specific fields (only when type === 'media')
  mediaType?: MediaType;       // image / video / audio / sticker / gif / document
  mediaFilename?: string;      // e.g. "IMG-20260812-WA0023.jpg"
  mediaLocalUri?: string;      // resolved FileSystem URI after first-launch copy
  mediaExists?: boolean;       // false if file not found (show placeholder)
  caption?: string;            // optional caption text below media
}
```

### 7.3 Your Name Detection
- Hardcode `YOUR_NAME = "Dinesh"` (or whichever name appears in the export as you)
- All messages from this name → `isSent: true` → right-side green bubble

### 7.4 Media Filename Detection
The parser detects media lines using this logic:
```typescript
// Pattern: filename followed by "(file attached)" or just a known media extension
const MEDIA_PATTERN = /^(IMG|PTT|VID|AUD|STK|DOC)-[\d-]+\.[\w]+(\s\(file attached\))?$/i;
const OMITTED_PATTERN = /^<Media omitted>$/i;

function detectMediaType(filename: string): MediaType {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg','jpeg','png','webp'].includes(ext)) return 'image';
  if (['mp4','mov','avi'].includes(ext)) return 'video';
  if (['opus','ogg','m4a','mp3','aac'].includes(ext)) return 'audio';
  if (ext === 'gif') return 'gif';
  if (ext === 'pdf') return 'document';
  if (ext === 'webp') return 'sticker'; // small webp = sticker heuristic
  return 'document';
}
```

### 7.5 Other Edge Cases to Handle
- `<Media omitted>` → type: 'media', mediaExists: false
- `This message was deleted` → type: 'deleted'
- `Messages and calls are end-to-end encrypted` → type: 'system'
- Multi-line messages (lines without a timestamp prefix belong to the previous message)
- Emojis in names (e.g., "Dia ❤️❤️")
- Unicode characters, Hindi/regional language text
- Media with caption (next line after media filename, no timestamp = caption)
- Sticker vs image disambiguation (sticker `.webp` files are typically < 100KB)

---

## 8. Performance Considerations

| Concern | Solution |
|---|---|
| Large chat files (50k+ messages) | `FlatList` with `windowSize`, `maxToRenderPerBatch`, `getItemLayout` |
| Initial load time | Parse in `useEffect` with `InteractionManager.runAfterInteractions` |
| Memory | Avoid storing full raw text in state after parsing |
| Re-renders | `React.memo` on message bubble component |
| 1GB media on first launch | Copy files progressively with progress bar; show app immediately after |
| Image memory | Use `expo-image` with `contentFit="cover"` and recycling — never load full-res in list |
| Video in list | Show thumbnail only (generated with `expo-video-thumbnails`), play on tap in separate screen |
| Audio in list | Load audio file only when play is tapped, not on render |
| Off-screen images | `FlatList` automatically unmounts off-screen items; `expo-image` handles cache |
| Missing media files | Check `FileSystem.getInfoAsync()` during parse, set `mediaExists: false` if not found |

---

## 9. Visual Design Tokens

```
Colors:
  --wa-dark-green:     #075E54   (header)
  --wa-green:          #128C7E   (accent)
  --wa-light-green:    #25D366   (online dot, mic button)
  --wa-teal:           #00A884   (sender name, ticks)
  --wa-sent-bubble:    #DCF8C6   (sent message bg)
  --wa-received-bubble:#FFFFFF   (received message bg)
  --wa-background:     #ECE5DD   (chat wallpaper)
  --wa-text-primary:   #111B21
  --wa-text-secondary: #667781   (timestamps, meta)
  --wa-input-bg:       #F0F2F5

Typography:
  Font: System default (San Francisco on iOS, Roboto on Android)
  Message text: 14.5sp regular
  Sender name: 13sp semibold
  Timestamp: 11sp regular
  Header name: 16sp semibold
  Date separator: 12sp regular
```

---

## 10. Project Structure

```
/
├── assets/
│   ├── chat.txt                      ← exported WhatsApp chat text (500KB)
│   └── media/                        ← all exported media files (~1GB)
│       ├── IMG-20260812-WA0023.jpg
│       ├── PTT-20260812-WA0024.opus
│       ├── VID-20260812-WA0025.mp4
│       └── ... (hundreds of files)
├── src/
│   ├── components/
│   │   ├── MessageBubble.tsx         ← routes to correct bubble type
│   │   ├── TextBubble.tsx            ← plain text message
│   │   ├── ImageBubble.tsx           ← photo with tap-to-expand
│   │   ├── VideoBubble.tsx           ← thumbnail + play button
│   │   ├── AudioBubble.tsx           ← voice note player
│   │   ├── StickerBubble.tsx         ← sticker (no background)
│   │   ├── DocumentBubble.tsx        ← PDF/file bubble
│   │   ├── MediaPlaceholder.tsx      ← when file is missing
│   │   ├── DateSeparator.tsx         ← date chip between messages
│   │   ├── SystemMessage.tsx         ← encrypted / event chips
│   │   ├── ChatHeader.tsx            ← top app bar
│   │   └── InputBar.tsx              ← static bottom bar
│   ├── screens/
│   │   ├── FirstLaunchScreen.tsx     ← one-time media copy + progress
│   │   ├── SplashScreen.tsx          ← loading screen
│   │   ├── ChatScreen.tsx            ← main chat FlatList
│   │   ├── ImageViewerScreen.tsx     ← full-screen photo viewer
│   │   └── VideoPlayerScreen.tsx     ← full-screen video player
│   ├── utils/
│   │   ├── parseChat.ts              ← .txt parser
│   │   ├── mediaResolver.ts          ← filename → FileSystem URI mapper
│   │   └── firstLaunch.ts            ← copy media, track completion
│   ├── types/
│   │   └── index.ts                  ← Message, MediaType interfaces
│   ├── hooks/
│   │   └── useAudioPlayer.ts         ← audio play/pause/seek logic
│   └── constants/
│       └── colors.ts                 ← design tokens
├── App.tsx
├── app.json                          ← expo config (increase asset limit)
└── package.json
```

---

## 11. Out of Scope (for V1)

- Search within chat
- Multiple chat files
- Sharing/exporting individual messages
- Dark mode toggle (can add in V2)
- Download/save media to gallery
- React to messages (emoji reactions)

---

## 12. Success Criteria

- [ ] Opens and parses `chat.txt` within 2 seconds
- [ ] Every message renders with correct sender alignment
- [ ] Date separators appear correctly between days
- [ ] Scrolls to the most recent message on load
- [ ] Visually indistinguishable from real WhatsApp on a screenshot
- [ ] Handles 10,000+ messages without lag
- [ ] Emoji-only messages render large
- [ ] System messages render as centered chips
- [ ] Photos render as real thumbnails, tap opens full-screen viewer
- [ ] Videos show thumbnail with play button, tap opens player
- [ ] Voice notes play with play/pause and duration
- [ ] Missing media files show graceful placeholder (not crash)
- [ ] First launch copies all media with progress bar
- [ ] Subsequent launches skip copy and load instantly
- [ ] App stays under 200MB RAM while scrolling through media-heavy chat

---

## 13. Emotional Design Note

This app is not a product — it's a **memory capsule**. Every design decision should serve one goal: making the person feel like they're back in that conversation. The UI should disappear, and only the memories should remain.

Keep it exactly like WhatsApp. Don't make it "better." Make it feel like *home*.

---

---

## 13. New Dependencies to Install

```bash
npx expo install expo-av              # audio + video playback
npx expo install expo-image           # fast image rendering
npx expo install expo-file-system     # read/copy media files
npx expo install expo-video-thumbnails # generate video thumbnails
npx expo install react-native-image-viewing  # fullscreen photo viewer
npx expo install @react-navigation/native @react-navigation/stack
npx expo install date-fns
```

Also add to `app.json`:
```json
"expo": {
  "plugins": [
    ["expo-av", { "microphonePermission": false }]
  ],
  "assetBundlePatterns": [
    "assets/**"
  ]
}
```

---

*PRD version 2.0 — Built for Dinesh* 💙