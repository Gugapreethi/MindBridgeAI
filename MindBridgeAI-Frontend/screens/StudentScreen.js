import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import { t } from '../utils/strings';

const STUDY_TIPS = [
  { title: 'Pomodoro Technique', desc: '25 min study + 5 min break', icon: '⏱' },
  { title: 'Deep Breathing', desc: '4-4-4 breathing to reduce stress', icon: '🌬' },
  { title: 'Body Scan', desc: 'Relax each muscle from head to toe', icon: '🧘' },
  { title: 'Take a Walk', desc: '10 min walk boosts memory by 20%', icon: '🚶' },
];

const CAMPUS_RESOURCES = [
  { name: 'SAHAS Counseling', number: '1800-599-0019', type: 'Counseling' },
  { name: 'iCall', number: '9152987821', type: 'Mental Health' },
  { name: 'Vandrevala Foundation', number: '18602662345', type: '24/7 Support' },
];

const AFFIRMATIONS = [
  "You are capable of more than you know! 💪",
  "One step at a time — you've got this! 🌟",
  "Your efforts today shape your tomorrow! 🔥",
  "It's okay to ask for help — that's strength! 💙",
  "You are enough, exactly as you are! ✨",
];

export default function StudentScreen({ userProfile }) {
  const lang = userProfile?.language || 'english';
  const [studyTimer, setStudyTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [breakMode, setBreakMode] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [stressLevel, setStressLevel] = useState(null);

  useEffect(() => {
    const random = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    setAffirmation(random);
  }, []);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setStudyTimer(prev => {
          if (prev >= (breakMode ? 300 : 1500)) {
            setTimerRunning(false);
            if (!breakMode) {
              Alert.alert(
                '⏰',
                lang === 'tamil'
                  ? '25 நிமிடம் முடிந்தது! Break எடு!'
                  : '25 minutes done! Take a break!',
                [{ text: lang === 'tamil' ? 'Break எடுக்கிறேன்!' : 'Start Break!',
                   onPress: () => { setBreakMode(true); setStudyTimer(0); setTimerRunning(true); }
                }]
              );
            } else {
              setBreakMode(false);
              setStudyTimer(0);
              Alert.alert('✅', lang === 'tamil' ? 'Break முடிந்தது! மீண்டும் படிக்கலாம்!' : 'Break done! Ready to study!');
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, breakMode]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalTime = breakMode ? 300 : 1500;
  const progress = (studyTimer / totalTime) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {lang === 'tamil' ? 'மாணவர் பகுதி' : 'Student Zone'}
        </Text>
        <Text style={styles.headerSub}>
          {lang === 'tamil' ? 'படிப்பு + மன ஆரோக்கியம்' : 'Study + Mental Wellness'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Daily Affirmation */}
        <View style={styles.affirmCard}>
          <Text style={styles.affirmLabel}>
            {lang === 'tamil' ? '✨ இன்றைய ஊக்கம்' : '✨ TODAY\'S AFFIRMATION'}
          </Text>
          <Text style={styles.affirmText}>{affirmation}</Text>
          <TouchableOpacity
            onPress={() => {
              const random = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
              setAffirmation(random);
            }}
          >
            <Text style={styles.refreshText}>
              {lang === 'tamil' ? 'புதியது →' : 'New one →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stress Check */}
        <Text style={styles.sectionLabel}>
          {lang === 'tamil' ? 'இன்றைய STRESS அளவு' : 'TODAY\'S STRESS LEVEL'}
        </Text>
        <View style={styles.card}>
          <View style={styles.stressRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.stressBtn,
                  stressLevel === level && styles.stressBtnSelected,
                  { backgroundColor: stressLevel === level
                    ? ['#22C55E', '#84CC16', '#EAB308', '#F97316', '#EF4444'][level - 1]
                    : theme.background }
                ]}
                onPress={() => setStressLevel(level)}
              >
                <Text style={styles.stressBtnText}>{level}</Text>
                <Text style={styles.stressEmoji}>
                  {['😌', '🙂', '😐', '😟', '😰'][level - 1]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {stressLevel && stressLevel >= 4 && (
            <View style={styles.stressAlert}>
              <Text style={styles.stressAlertText}>
                {lang === 'tamil'
                  ? 'Stress அதிகமாக இருக்கு — கீழே உள்ள tips try பண்ணு!'
                  : 'High stress detected — try the tips below!'}
              </Text>
            </View>
          )}
        </View>

        {/* Pomodoro Timer */}
        <Text style={styles.sectionLabel}>
          {lang === 'tamil' ? 'படிப்பு TIMER' : 'STUDY TIMER'}
        </Text>
        <View style={styles.card}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerMode}>
              {breakMode
                ? lang === 'tamil' ? '☕ Break Time' : '☕ Break Time'
                : lang === 'tamil' ? '📚 Study Time' : '📚 Study Time'}
            </Text>
            <Text style={styles.timerDisplay}>
              {formatTime(breakMode ? 300 - studyTimer : 1500 - studyTimer)}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timerBtns}>
              <TouchableOpacity
                style={[styles.timerBtn, timerRunning && styles.timerBtnStop]}
                onPress={() => setTimerRunning(!timerRunning)}
              >
                <Text style={styles.timerBtnText}>
                  {timerRunning
                    ? lang === 'tamil' ? 'நிறுத்து' : 'Pause'
                    : lang === 'tamil' ? 'ஆரம்பி' : 'Start'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timerResetBtn}
                onPress={() => { setStudyTimer(0); setTimerRunning(false); setBreakMode(false); }}
              >
                <Text style={styles.timerResetText}>
                  {lang === 'tamil' ? 'Reset' : 'Reset'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Study Tips */}
        <Text style={styles.sectionLabel}>
          {lang === 'tamil' ? 'STRESS குறைக்கும் TIPS' : 'STRESS RELIEF TIPS'}
        </Text>
        {STUDY_TIPS.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <Text style={styles.tipIcon}>{tip.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDesc}>{tip.desc}</Text>
            </View>
          </View>
        ))}

        {/* Campus Resources */}
        <Text style={styles.sectionLabel}>
          {lang === 'tamil' ? 'CAMPUS RESOURCES' : 'CAMPUS RESOURCES'}
        </Text>
        {CAMPUS_RESOURCES.map((resource, index) => (
          <View key={index} style={styles.resourceCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resourceName}>{resource.name}</Text>
              <Text style={styles.resourceType}>{resource.type}</Text>
            </View>
            <View style={styles.resourcePill}>
              <Text style={styles.resourceNumber}>{resource.number}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  scroll: { padding: 16, paddingBottom: 30 },
  sectionLabel: {
    fontSize: 10, fontWeight: '600', color: theme.textMuted,
    letterSpacing: 0.8, marginBottom: 8, marginTop: 4,
  },
  affirmCard: {
    backgroundColor: '#EEF2FF', borderRadius: theme.radius,
    padding: 16, marginBottom: 16,
    borderWidth: 0.5, borderColor: '#C7D2FE',
  },
  affirmLabel: {
    fontSize: 10, fontWeight: '600', color: '#3451B2',
    letterSpacing: 0.8, marginBottom: 8,
  },
  affirmText: {
    fontSize: 15, color: '#3451B2', fontWeight: '500',
    lineHeight: 22, marginBottom: 8,
  },
  refreshText: { fontSize: 12, color: '#3451B2', fontWeight: '500' },
  card: {
    backgroundColor: theme.card, borderRadius: theme.radius,
    padding: 14, marginBottom: 16,
    borderWidth: 0.5, borderColor: theme.border,
  },
  stressRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  stressBtn: {
    flex: 1, borderRadius: 8, padding: 10,
    alignItems: 'center', borderWidth: 1, borderColor: theme.border,
  },
  stressBtnSelected: { borderWidth: 0 },
  stressBtnText: { fontSize: 14, fontWeight: '600', color: theme.textPrimary },
  stressEmoji: { fontSize: 18, marginTop: 4 },
  stressAlert: {
    backgroundColor: '#FFF1F2', borderRadius: 8,
    padding: 10, marginTop: 8,
  },
  stressAlertText: { fontSize: 12, color: '#E11D48', lineHeight: 18 },
  timerContainer: { alignItems: 'center', padding: 8 },
  timerMode: { fontSize: 13, color: theme.textSecondary, marginBottom: 8 },
  timerDisplay: {
    fontSize: 52, fontWeight: '700',
    color: theme.primary, letterSpacing: 2,
  },
  progressBar: {
    width: '100%', height: 4, backgroundColor: theme.background,
    borderRadius: 2, marginVertical: 16, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: theme.primary, borderRadius: 2 },
  timerBtns: { flexDirection: 'row', gap: 10 },
  timerBtn: {
    backgroundColor: theme.primary, borderRadius: 8,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  timerBtnStop: { backgroundColor: '#E11D48' },
  timerBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  timerResetBtn: {
    backgroundColor: theme.background, borderRadius: 8,
    paddingHorizontal: 24, paddingVertical: 12,
    borderWidth: 0.5, borderColor: theme.border,
  },
  timerResetText: { fontSize: 14, color: theme.textSecondary, fontWeight: '500' },
  tipCard: {
    backgroundColor: theme.card, borderRadius: theme.radius,
    padding: 14, marginBottom: 8, flexDirection: 'row',
    alignItems: 'center', gap: 12,
    borderWidth: 0.5, borderColor: theme.border,
  },
  tipIcon: { fontSize: 24 },
  tipTitle: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  tipDesc: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
  resourceCard: {
    backgroundColor: theme.card, borderRadius: theme.radius,
    padding: 14, marginBottom: 8, flexDirection: 'row',
    alignItems: 'center', borderWidth: 0.5, borderColor: theme.border,
  },
  resourceName: { fontSize: 13, fontWeight: '600', color: theme.textPrimary },
  resourceType: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
  resourcePill: {
    backgroundColor: '#EEF2FF', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  resourceNumber: { fontSize: 11, color: '#3451B2', fontWeight: '500' },
});