import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView
} from 'react-native';

export default function HomeScreen({ userProfile, navigation }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'காலை வணக்கம் 🌅';
    if (hour < 17) return 'மதிய வணக்கம் ☀️';
    return 'மாலை வணக்கம் 🌙';
  };

  const getUserEmoji = () => {
    const emojis = {
      student: '🎓', professional: '💼',
      elder: '👴', homemaker: '🏠', teenager: '🧑'
    };
    return emojis[userProfile?.userType] || '👋';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.heroName}>
                {getUserEmoji()} {userProfile?.userType}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>💙 Safe</Text>
            </View>
          </View>
          <Text style={styles.heroQuote}>
            "உன்னோட feelings valid — நீ alone இல்ல!"
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#3498DB' }]}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.quickEmoji}>💬</Text>
            <Text style={styles.quickLabel}>Talk to AI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#2ECC71' }]}
            onPress={() => navigation.navigate('Mood')}
          >
            <Text style={styles.quickEmoji}>📊</Text>
            <Text style={styles.quickLabel}>Mood Log</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#9B59B6' }]}
            onPress={() => navigation.navigate('Crisis')}
          >
            <Text style={styles.quickEmoji}>💙</Text>
            <Text style={styles.quickLabel}>Get Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📋 Daily Check-in</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>இன்னைக்கு உன் mood log பண்ணினியா? 2 minutes மட்டும்!</Text>
          <TouchableOpacity style={styles.cardBtn} onPress={() => navigation.navigate('Mood')}>
            <Text style={styles.cardBtnText}>Check In Now →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { borderLeftColor: '#F39C12', borderLeftWidth: 4 }]}>
          <Text style={styles.cardTitle}>💡 Tip of the Day</Text>
          <Text style={styles.cardDesc}>
            5 minutes deep breathing — anxiety 40% குறையும். Try பண்ணு!
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>😊</Text>
            <Text style={styles.statLabel}>Avg Mood</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Chats Done</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scroll: { padding: 20 },
  hero: { backgroundColor: '#2C3E50', borderRadius: 24, padding: 24, marginBottom: 24 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  greeting: { color: '#BDC3C7', fontSize: 14, marginBottom: 4 },
  heroName: { color: 'white', fontSize: 22, fontWeight: 'bold', textTransform: 'capitalize' },
  badge: { backgroundColor: '#27AE60', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  heroQuote: { color: '#D6EAF8', fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickCard: { width: '31%', borderRadius: 16, padding: 16, alignItems: 'center', elevation: 3 },
  quickEmoji: { fontSize: 28, marginBottom: 6 },
  quickLabel: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', flex: 1 },
  newBadge: { backgroundColor: '#E74C3C', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  newBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  cardDesc: { fontSize: 14, color: '#7F8C8D', marginBottom: 12, lineHeight: 20 },
  cardBtn: { backgroundColor: '#3498DB', borderRadius: 20, padding: 10, alignItems: 'center' },
  cardBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, width: '31%', alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#7F8C8D', textAlign: 'center' },
});