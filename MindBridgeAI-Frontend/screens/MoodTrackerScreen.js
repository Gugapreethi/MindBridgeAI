import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView
} from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const MOODS = [
  { id: 5, emoji: '😄', label: 'Great' },
  { id: 4, emoji: '🙂', label: 'Good' },
  { id: 3, emoji: '😐', label: 'Okay' },
  { id: 2, emoji: '😔', label: 'Low' },
  { id: 1, emoji: '😢', label: 'Bad' },
];

export default function MoodTrackerScreen({ onOpenChat }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([3, 4, 2, 3, 4, 3, 5]);
  const [saved, setSaved] = useState(false);

  const getInsight = () => {
    const avg = moodHistory.reduce((a, b) => a + b, 0) / moodHistory.length;
    if (avg >= 4) return { text: 'உன் week fantastic-ஆ இருக்கு! 🌟', color: '#27AE60' };
    if (avg >= 3) return { text: 'This week was balanced. Keep going! 💪', color: '#F39C12' };
    return { text: 'கடந்த சில நாள் கஷ்டமா இருந்துச்சு. பேசலாமா? 💙', color: '#E74C3C' };
  };

  const saveMood = () => {
    if (!selectedMood) return;
    const updated = [...moodHistory.slice(-6), selectedMood];
    setMoodHistory(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const insight = getInsight();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const moodEmojis = ['😢', '😔', '😐', '🙂', '😄'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.headerText}>📊 Mood Tracker</Text>
          <Text style={styles.headerSub}>இன்னைக்கு எப்படி இருக்க?</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Mood</Text>
          <View style={styles.moodRow}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodBtn, selectedMood === mood.id && styles.moodBtnSelected]}
                onPress={() => setSelectedMood(mood.id)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, !selectedMood && styles.saveBtnDisabled]}
            onPress={saveMood}
            disabled={!selectedMood}
          >
            <Text style={styles.saveBtnText}>{saved ? '✅ Saved!' : 'Save Mood'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.insightCard, { borderLeftColor: insight.color }]}>
          <Text style={styles.insightText}>{insight.text}</Text>
        </View>

        {/* Simple Mood Chart — no library needed */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Last 7 Days</Text>
          <View style={styles.chartContainer}>
            {moodHistory.map((mood, index) => (
              <View key={index} style={styles.chartBar}>
                <Text style={styles.chartEmoji}>{moodEmojis[mood - 1]}</Text>
                <View style={[styles.bar, { height: mood * 20, backgroundColor: insight.color }]} />
                <Text style={styles.chartDay}>{days[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.chatBtn} onPress={onOpenChat}>
          <Text style={styles.chatBtnText}>💬 Talk to MindBridge AI</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scroll: { padding: 20 },
  header: { backgroundColor: '#3498DB', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
  headerText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#D6EAF8', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  moodBtn: { alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', width: 60 },
  moodBtnSelected: { borderColor: '#3498DB', backgroundColor: '#EBF5FB' },
  moodEmoji: { fontSize: 28 },
  moodLabel: { fontSize: 11, color: '#7F8C8D', marginTop: 4 },
  saveBtn: { backgroundColor: '#3498DB', borderRadius: 20, padding: 12, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: '#BDC3C7' },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  insightCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 4, elevation: 2 },
  insightText: { fontSize: 15, color: '#2C3E50', lineHeight: 22 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: 10 },
  chartBar: { alignItems: 'center', flex: 1 },
  chartEmoji: { fontSize: 16, marginBottom: 4 },
  bar: { width: 20, borderRadius: 4, minHeight: 4 },
  chartDay: { fontSize: 10, color: '#7F8C8D', marginTop: 4 },
  chatBtn: { backgroundColor: '#2ECC71', borderRadius: 25, padding: 16, alignItems: 'center', marginBottom: 20 },
  chatBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});