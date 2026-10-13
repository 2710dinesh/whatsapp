import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TextInput, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle, Polygon, Rect, Polyline, Line } from 'react-native-svg';
import { Calendar } from 'react-native-calendars';
import { WhatsAppColors } from '../constants/colors';

// @ts-ignore
const defaultProfileImage = require('../../assets/profile.jpg');

const PhoneIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const VideoIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="23 7 16 12 23 17 23 7" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </Svg>
);

const MoreIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="5" r="1" />
    <Circle cx="12" cy="12" r="1" />
    <Circle cx="12" cy="19" r="1" />
  </Svg>
);

const BackIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
);

interface ChatHeaderProps {
  contactName: string;
  status?: string;
  onMenuPress?: () => void;
}

export const ChatHeader = React.memo(function ChatHeader({
  contactName,
  status,
  onMenuPress,
}: ChatHeaderProps) {
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef<any>(null);
  const tapCountRef = useRef(0);
  // ReturnType works in both the browser and React Native's timer typings.
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initials = contactName
    .split(/[\s❤️]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  const handleAvatarPress = () => {
    tapCountRef.current += 1;

    if (tapCountRef.current === 1) {
      tapTimeoutRef.current = setTimeout(() => {
        if (tapCountRef.current === 1) {
          // Single tap - open image modal
          setShowImageModal(true);
        }
        tapCountRef.current = 0;
      }, 300);
    } else if (tapCountRef.current === 2) {
      // Double tap - open file picker
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      tapCountRef.current = 0;
      if (Platform.OS === 'web' && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileSelect = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentImage = profileImage || defaultProfileImage;

  return (
    <>
      <View style={[styles.container, { paddingTop: insets?.top ?? 0 }]}>
        <View style={styles.content}>
          {/* Left: Back + Avatar + Info */}
          <View style={styles.left}>
            <Pressable style={styles.backButton}>
              <BackIcon />
            </Pressable>

            <Pressable style={styles.avatar} onPress={handleAvatarPress}>
              <Image
                source={typeof currentImage === 'string' ? { uri: currentImage } : currentImage}
                style={styles.avatarImage}
              />
            </Pressable>

            <View style={styles.info}>
              <Text style={styles.name}>{contactName}</Text>
              <Text style={styles.status}>{status}</Text>
            </View>
          </View>

          {/* Right: Icons */}
          <View style={styles.right}>
            <Pressable style={styles.iconButton}>
              <PhoneIcon />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <VideoIcon />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={onMenuPress}>
              <MoreIcon />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Image Modal - Single Tap */}
      {showImageModal && (
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowImageModal(false)}
        >
          <View style={styles.modalContent}>
            <Image
              source={typeof currentImage === 'string' ? { uri: currentImage } : currentImage}
              style={styles.fullImage}
            />
            <Text style={styles.closeHint}>Tap to close</Text>
          </View>
        </Pressable>
      )}


      {/* Hidden file input for web */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}
    </>
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  fullImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
  },
  closeHint: {
    position: 'absolute',
    bottom: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 2000,
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContent: {
    backgroundColor: '#1E272C',
    borderRadius: 12,
    padding: 16,
    width: 300,
    gap: 16,
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#AAAAAA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A4A5A',
  },
  filterContainer: {
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A4A5A',
  },
  label: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '600',
  },
  textInputStyle: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 10,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#3A4A5A',
  },
  clearSearchButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#2C3E50',
    borderRadius: 6,
  },
  clearSearchText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
  },
  datePickerButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A4A5A',
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  dateButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#00A884',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  clearButtonStyle: {
    backgroundColor: '#FF6B6B',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusContainer: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
