import React, { useMemo, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
  useWindowDimensions,
  ImageBackground,
  Text,
  Pressable,
  StatusBar,
} from 'react-native';
import { Message, MessageGroup, SenderProfile } from '../types';
import { MessageBubble } from '../components/MessageBubble';
import { ChatHeader } from '../components/ChatHeader';
import { SearchBar } from '../components/SearchBar';

// @ts-ignore
const bgImage = require('../../assets/chat-bg.jpg');

const CHARS_PER_LINE = 32;
const LINE_HEIGHT = 20;
const BUBBLE_CHROME_HEIGHT = 40; // padding + timestamp row
const BUBBLE_MARGIN = 8;
const SYSTEM_ITEM_HEIGHT = 56; // date separator pill

function estimateMessageHeight(text: string): number {
  const lines = Math.max(1, Math.ceil(text.length / CHARS_PER_LINE));
  return lines * LINE_HEIGHT + BUBBLE_CHROME_HEIGHT + BUBBLE_MARGIN;
}

function estimateGroupHeight(group: MessageGroup): number {
  if (group.sender === 'SYSTEM') return SYSTEM_ITEM_HEIGHT;
  return group.messages.reduce((sum, msg) => sum + estimateMessageHeight(msg.text || ''), 0);
}

interface ChatScreenProps {
  messageGroups: MessageGroup[];
  senders: Record<string, SenderProfile>;
}

export const ChatScreen = React.memo(function ChatScreen({
  messageGroups,
  senders,
}: ChatScreenProps) {
  const { width } = useWindowDimensions();
  const [stickyDate, setStickyDate] = React.useState<string>('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [currentResultIndex, setCurrentResultIndex] = React.useState(0);
  const [filteredGroups, setFilteredGroups] = React.useState<MessageGroup[]>(messageGroups);
  const flatListRef = React.useRef<any>(null);
  const pendingScrollIndexRef = React.useRef<number | null>(null);

  const scrollToTop = () => {
    if (displayGroups.length > 0) {
      setTimeout(() => {
        try {
          flatListRef.current?.scrollToIndex({
            index: displayGroups.length - 1,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (e) {
          flatListRef.current?.scrollToOffset({ offset: 999999, animated: true });
        }
      }, 100);
    }
  };

  const scrollToBottom = () => {
    if (displayGroups.length > 0) {
      setTimeout(() => {
        try {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (e) {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
      }, 100);
    }
  };

  const handleScrollToIndexFailed = (info: any) => {
    const targetIndex = pendingScrollIndexRef.current ?? info.index;
    const estimatedOffset = info.averageItemLength * targetIndex;

    flatListRef.current?.scrollToOffset({ offset: estimatedOffset, animated: false });

    setTimeout(() => {
      try {
        flatListRef.current?.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewPosition: 0.3,
        });
      } catch (e) {
        // will retry again via onScrollToIndexFailed if still out of range
      }
    }, 100);
  };

  const getDateLabel = (timestamp: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (timestamp.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (timestamp.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return timestamp.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  const handleViewableItemsChanged = React.useCallback(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const topVisibleItem = viewableItems[viewableItems.length - 1];
      if (topVisibleItem && topVisibleItem.item) {
        const group = topVisibleItem.item as MessageGroup;
        if (group.messages[0]?.timestamp) {
          setStickyDate(getDateLabel(group.messages[0].timestamp));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (messageGroups.length > 0) {
      const lastGroup = messageGroups[messageGroups.length - 1];
      if (lastGroup.messages[0]?.timestamp) {
        setStickyDate(getDateLabel(lastGroup.messages[0].timestamp));
      }
    }
  }, [messageGroups]);

  const viewabilityConfig = React.useMemo(
    () => ({ itemVisiblePercentThreshold: 50 }),
    []
  );

  const receiverName = 'Diaaaa❤️❤️';

  // Filter messages based on search and date
  const allMessages = useMemo(() => {
    return messageGroups.flatMap(group => group.messages);
  }, [messageGroups]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return allMessages;

    return allMessages.filter(msg =>
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allMessages]);

  const displayGroups = useMemo(() => {
    if (!searchQuery.trim()) return filteredGroups;

    const matchingIds = new Set(searchResults.map(m => m.id));
    return filteredGroups.filter(group => {
      if (group.sender === 'SYSTEM') return true;
      return group.messages.some(msg => matchingIds.has(msg.id));
    });
  }, [searchQuery, filteredGroups, searchResults]);

  const itemLayoutCache = useMemo(() => {
    let offset = 0;
    return displayGroups.map(group => {
      const length = estimateGroupHeight(group);
      const layout = { length, offset };
      offset += length;
      return layout;
    });
  }, [displayGroups]);

  const getItemLayout = React.useCallback(
    (data: ArrayLike<MessageGroup> | null | undefined, index: number) => {
      const cached = itemLayoutCache[index];
      if (cached) return { length: cached.length, offset: cached.offset, index };
      return { length: 60, offset: 60 * index, index };
    },
    [itemLayoutCache]
  );

  React.useEffect(() => {
    setFilteredGroups(messageGroups);
  }, [messageGroups]);

  React.useEffect(() => {
    if (!selectedDate || displayGroups.length === 0) return;

    const targetIndex = displayGroups.findIndex(group => {
      if (group.sender === 'SYSTEM') return false;
      return group.messages.some(msg => msg.timestamp.toLocaleDateString('en-CA') === selectedDate);
    });

    if (targetIndex >= 0) {
      pendingScrollIndexRef.current = targetIndex;
      // getItemLayout gives FlatList a precomputed offset, so this jumps directly
      // without the measure-fail-retry cycle that made distant jumps slow.
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.3,
      });
    }
  }, [selectedDate, displayGroups]);

  const handleSearch = (query: string, date: string | null) => {
    setSearchQuery(query);
    setCurrentResultIndex(0);
    if (date) {
      setSelectedDate(date);
    }
  };

  const currentResultMessage = useMemo(() => {
    if (searchQuery.trim() && searchResults.length > 0 && currentResultIndex < searchResults.length) {
      return searchResults[currentResultIndex];
    }
    return null;
  }, [searchQuery, currentResultIndex, searchResults]);

  const renderMessage = (info: ListRenderItemInfo<MessageGroup>) => {
    const group = info.item;

    if (group.sender === 'SYSTEM') {
      return null;
    }

    return (
      <View key={group.id}>
        {group.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            senderProfile={senders[msg.sender]}
            showSenderName={false}
            searchQuery={searchQuery}
            isCurrentResult={currentResultMessage?.id === msg.id}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      <ChatHeader
        contactName={receiverName}
        onMenuPress={() => setShowSearch(!showSearch)}
      />

      {showSearch && (
        <SearchBar
          onSearch={handleSearch}
          onDone={() => {
            setShowSearch(false);
            setSearchQuery('');
            setSelectedDate(null);
            setCurrentResultIndex(0);
          }}
          resultCount={searchResults.length}
          currentResultIndex={currentResultIndex}
          onPrevious={() => {
            if (currentResultIndex > 0) {
              setCurrentResultIndex(currentResultIndex - 1);
            }
          }}
          onNext={() => {
            if (currentResultIndex < searchResults.length - 1) {
              setCurrentResultIndex(currentResultIndex + 1);
            }
          }}
        />
      )}

      <View style={styles.chatContainer}>
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
          <FlatList
            ref={flatListRef}
            data={displayGroups}
            renderItem={({ item }) => renderMessage({ item } as any)}
            keyExtractor={(item) => item.id}
            inverted={true}
            scrollEventThrottle={16}
            removeClippedSubviews={false}
            windowSize={20}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScrollToIndexFailed={handleScrollToIndexFailed}
            getItemLayout={getItemLayout}
          />
        </ImageBackground>

        {/* Scroll buttons */}
        <View style={styles.scrollButtons}>
          <Pressable
            style={[styles.scrollButton, styles.upButton]}
            onPress={scrollToTop}
          >
            <Text style={styles.arrowText}>↑</Text>
          </Pressable>
          <Pressable
            style={[styles.scrollButton, styles.downButton]}
            onPress={scrollToBottom}
          >
            <Text style={styles.arrowText}>↓</Text>
          </Pressable>
        </View>

        {stickyDate ? (
          <View style={styles.stickyHeader}>
            <View style={styles.stickyDateBubble}>
              <Text style={styles.stickyDateLabel}>{stickyDate}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54',
  },
  chatContainer: {
    flex: 1,
    position: 'relative',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  stickyHeader: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 999,
    paddingHorizontal: 16,
  },
  stickyDateBubble: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  stickyDateLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  scrollButtons: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    gap: 8,
  },
  scrollButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  upButton: {
    backgroundColor: '#00A884',
  },
  downButton: {
    backgroundColor: '#00A884',
  },
  arrowText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
