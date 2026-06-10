import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { theme } from '../utils/theme';
import { t } from '../utils/strings';

const MEMORY_GAMES = [
  {
    id: 1,
    words: ['வீடு', 'மரம்', 'பூ', 'நீர்', 'மலை'],
    english: ['House', 'Tree', 'Flower', 'Water', 'Mountain']
  },
  {
    id: 2,
    words: ['சூரியன்', 'நிலா', 'நட்சத்திரம்', 'மேகம்', 'மழை'],
    english: ['Sun', 'Moon', 'Star', 'Cloud', 'Rain']
  },
  {
    id: 3,
    words: ['அன்பு', 'நம்பிக்கை', 'மகிழ்ச்சி', 'அமைதி', 'கருணை'],
    english: ['Love', 'Trust', 'Joy', 'Peace', 'Kindness']
  },
];

const MEDICATIONS = [
  { id: 1, name: 'Morning Medicine', time: '8:00 AM', taken: false },
  { id: 2, name: 'Afternoon Medicine', time: '2:00 PM', taken: false },
  { id: 3, name: 'Night Medicine', time: '9:00 PM', taken: false },
];

export default function ElderScreen({ userProfile }) {
  const lang = userProfile?.language || 'english';
  const [medications, setMedications] = useState(MEDICATIONS);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [showWords, setShowWords] = useState(true);
  const [userInput, setUserInput] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: lang === 'tamil' ? 'ta-IN' : 'en-IN',
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
    });
  };

  const markMedication = (id) => {
    setMedications(prev =>
      prev.map(m => m.id === id ? { ...m, taken: true } : m)
    );
    Alert.alert(
      '✅',
      lang === 'tamil'
        ? 'மருந்து எடுத்துவிட்டீர்கள்!'
        : 'Medication marked as taken!'
    );
  };

  const startMemoryGame = () => {
    const game = MEMORY_GAMES[Math.floor(Math.random() * MEMORY_GAMES.length)];
    setCurrentGame(game);
    setShowWords(true);
    setGameStarted(true);
    setGameResult(null);
    setUserInput([]);

    const words = lang === 'tamil' ? game.words : game.english;
    speakText(words.join(', '));

    setTimeout(() => setShowWords(false), 8000);
  };

  const selectWord = (word) => {
    if (userInput.includes(word)) {
      setUserInput(prev => prev.filter(w => w !== word));
    } else {
      setUserInput(prev => [...prev, word]);
    }
  };

  const checkResult = () => {
    if (!currentGame) return;
    const words = lang === 'tamil' ? currentGame.words : currentGame.english;
    const correct = userInput.filter(w => words.includes(w)).length;
    setGameResult({
      correct,
      total: words.length,
      percentage: Math.round((correct / words.length) * 100)
    });
  };

  const ALL_WORDS = [
    ...MEMORY_GAMES.flatMap(g =>
      lang === 'tamil' ? g.words : g.english
    )
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {lang === 'tamil' ? 'மூத்தோர் பகுதி' : 'Elder Care'}
        </Text>
        <Text style={styles.headerSub}>
          {lang === 'tamil' ? 'உங்களுக்காக தனிப்பட்டது' : 'Specially for you'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Medication Tracker */}
        <Text style={styles.sectionLabel}>
          {lang === 'tamil' ? 'மருந்து நினைவூட்டல்' : 'MEDICATION REMINDER'}
        </Text>
        <View style={styles.card}>
          {medications.map((med) => (
            <View key={med.id} style={styles.medRow}>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medTime}>{med.time}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.medBtn,
                  med.taken && styles.medBtnTaken
                ]}
                onPress={() => !med.taken && markMedication(med.id)}
              >
                <Text style={styles.medBtnText}>
                  {med.taken
                    ? '✓ Done'
                    : lang === 'tamil' ? 'எடுத்தேன்' : 'Taken'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Memory Game */}
        <Text style={styles.sectionLabel}>
          {lang === 'tamil' ? 'நினைவாற்றல் விளையாட்டு' : 'MEMORY EXERCISE'}
        </Text>
        <View style={styles.card}>
          {!gameStarted ? (
            <View style={styles.gameStart}>
              <Text style={styles.gameDesc}>
                {lang === 'tamil'
                  ? '5 வார்த்தைகளை நினைவில் வையுங்கள்!'
                  : 'Remember 5 words shown for 8 seconds!'}
              </Text>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={startMemoryGame}
              >
                <Text style={styles.startBtnText}>
                  {lang === 'tamil' ? 'ஆரம்பிக்கலாம்!' : 'Start Game!'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : showWords ? (
            <View style={styles.wordsContainer}>
              <Text style={styles.gameInstruct}>
                {lang === 'tamil' ? 'நினைவில் வையுங்கள்!' : 'Remember these!'}
              </Text>
              {(lang === 'tamil'
                ? currentGame.words
                : currentGame.english
              ).map((word, i) => (
                <View key={i} style={styles.wordTag}>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
              <Text style={styles.timerText}>
                {lang === 'tamil'
                  ? '8 seconds பார்க்கலாம்...'
                  : '8 seconds to remember...'}
              </Text>
            </View>
          ) : gameResult ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultScore}>
                {gameResult.correct}/{gameResult.total}
              </Text>
              <Text style={styles.resultText}>
                {gameResult.percentage >= 80
                  ? lang === 'tamil' ? 'மிகவும் நல்லது! 🎉' : 'Excellent! 🎉'
                  : gameResult.percentage >= 60
                  ? lang === 'tamil' ? 'நல்ல முயற்சி! 👍' : 'Good try! 👍'
                  : lang === 'tamil' ? 'மீண்டும் முயற்சி! 💪' : 'Try again! 💪'
                }
              </Text>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={startMemoryGame}
              >
                <Text style={styles.startBtnText}>
                  {lang === 'tamil' ? 'மீண்டும்' : 'Play Again'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.gameInstruct}>
                {lang === 'tamil'
                  ? 'நீங்கள் பார்த்த வார்த்தைகளை தேர்வு செய்யுங்கள்!'
                  : 'Select the words you saw!'}
              </Text>
              <View style={styles.wordGrid}>
                {ALL_WORDS.slice(0, 10).map((word, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.wordOption,
                      userInput.includes(word) && styles.wordOptionSelected
                    ]}
                    onPress={() => selectWord(word)}
                  >
                    <Text style={[
                      styles.wordOptionText,
                      userInput.includes(word) && styles.wordOptionTextSelected
                    ]}>
                      {word}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={checkResult}
              >
                <Text style={styles.startBtnText}>
                  {lang === 'tamil' ? 'சரிபார்' : 'Check Result'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Voice Read Button */}
        <Text style={styles.sectionLabel}>
          {lang === 'tamil' ? 'குரல் உதவி' : 'VOICE ASSISTANT'}
        </Text>
        <View style={styles.card}>
          <Text style={styles.voiceDesc}>
            {lang === 'tamil'
              ? 'தினசரி ஆரோக்கிய குறிப்புகளை கேளுங்கள்'
              : 'Listen to daily health tips'}
          </Text>
          <TouchableOpacity
            style={[styles.voiceBtn, isSpeaking && styles.voiceBtnActive]}
            onPress={() => speakText(
              lang === 'tamil'
                ? 'தினமும் காலையில் கொஞ்சம் நடையாடுங்கள். தண்ணீர் அதிகமாக குடியுங்கள். குடும்பத்தினரிடம் பேசுங்கள்.'
                : 'Walk a little every morning. Drink plenty of water. Talk to your family members.'
            )}
          >
            <Text style={styles.voiceBtnText}>
              {isSpeaking
                ? lang === 'tamil' ? '🔊 பேசுகிறது...' : '🔊 Speaking...'
                : lang === 'tamil' ? '🔊 குரல் கேளுங்கள்' : '🔊 Listen Now'}
            </Text>
          </TouchableOpacity>
        </View>

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
  card: {
    backgroundColor: theme.card, borderRadius: theme.radius,
    padding: 14, marginBottom: 16,
    borderWidth: 0.5, borderColor: theme.border,
  },
  medRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: theme.border,
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 14, fontWeight: '500', color: theme.textPrimary },
  medTime: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
  medBtn: {
    backgroundColor: theme.primary, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  medBtnTaken: { backgroundColor: '#16A34A' },
  medBtnText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  gameStart: { alignItems: 'center', padding: 10 },
  gameDesc: {
    fontSize: 13, color: theme.textSecondary,
    textAlign: 'center', marginBottom: 16, lineHeight: 20,
  },
  startBtn: {
    backgroundColor: theme.primary, borderRadius: 8,
    padding: 12, alignItems: 'center', marginTop: 10,
  },
  startBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  wordsContainer: { alignItems: 'center', padding: 10 },
  gameInstruct: {
    fontSize: 13, fontWeight: '500', color: theme.textPrimary,
    marginBottom: 16, textAlign: 'center',
  },
  wordTag: {
    backgroundColor: '#EEF2FF', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8, marginBottom: 8,
    borderWidth: 0.5, borderColor: '#C7D2FE',
  },
  wordText: { fontSize: 18, color: '#3451B2', fontWeight: '600' },
  timerText: { fontSize: 11, color: theme.textMuted, marginTop: 12 },
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  wordOption: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, borderColor: theme.border,
    backgroundColor: theme.background,
  },
  wordOptionSelected: {
    borderColor: theme.primary, backgroundColor: '#F0F2F8', borderWidth: 1.5,
  },
  wordOptionText: { fontSize: 13, color: theme.textSecondary },
  wordOptionTextSelected: { color: theme.primary, fontWeight: '600' },
  resultContainer: { alignItems: 'center', padding: 10 },
  resultScore: { fontSize: 48, fontWeight: '700', color: theme.primary },
  resultText: { fontSize: 16, color: theme.textSecondary, marginTop: 8 },
  voiceDesc: { fontSize: 13, color: theme.textSecondary, marginBottom: 12 },
  voiceBtn: {
    backgroundColor: theme.primary, borderRadius: 8,
    padding: 14, alignItems: 'center',
  },
  voiceBtnActive: { backgroundColor: '#16A34A' },
  voiceBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
});