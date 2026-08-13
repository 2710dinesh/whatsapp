import React from 'react';
import { View, Text, StyleSheet, Pressable, useSafeAreaInsets } from 'react-native';
import { WhatsAppColors } from '../constants/colors';

interface ChatHeaderProps {
  contactName: string;
  status?: string;
}

export const ChatHeader = React.memo(function ChatHeader({
  contactName,
  status = 'tap here for contact info',
}: ChatHeaderProps) {
  const insets = useSafeAreaInsets();
  const initials = contactName
    .split(/[\s❤️]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Left: Back + Avatar + Info */}
        <View style={styles.left}>
          <Pressable style={styles.backButton}>
            <Text style={styles.iconText}>‹</Text>
          </Pressable>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{contactName}</Text>
            <Text style={styles.status}>{status}</Text>
          </View>
        </View>

        {/* Right: Icons */}
        <View style={styles.right}>
          <Pressable style={styles.iconButton}>
            <Text style={styles.iconText}>☎</Text>
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Text style={styles.iconText}>🎥</Text>
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Text style={styles.iconText}>⋮</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: WhatsAppColors.headerBg,
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 48,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A884',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    color: WhatsAppColors.headerText,
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    color: WhatsAppColors.statusText,
    fontSize: 11,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    color: 'white',
    fontSize: 20,
  },
});
