import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Linking, Alert
} from 'react-native';

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'no reason to live', 'hurt myself', 'self harm',
  'சாக வேணும்', 'இனி வாழ வேண்டாம்', 'என்னால முடியல',
  'உயிரை மாய்ச்சுக்கணும்', 'வாழ்க்கை வேண்டாம்',
];

const HELPLINES = [
  { name: 'iCall', number: '9152987821', desc: 'Mon-Sat, 8am-10pm', color: '#E74C3C' },
  { name: 'Vandrevala Foundation', number: '18602662345', desc: '24/7 Free helpline', color: '#8E44AD' },
  { name: 'SNEHI', number: '04424640050', desc: 'Emotional support', color: '#2980B9' },
  { name: 'Emergency', number: '112', desc: 'Police / Ambulance', color: '#C0392B' },
];

export function detectCrisis(message) {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some((word) => lower.includes(word));
}

export default function CrisisScreen({ navigation }) {
  const callHelpline = (number) => {
    Alert.alert(
      'Call Helpline',
      `${number} — call பண்ணவா?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.headerEmoji}>💙</Text>
          <Text style={styles.headerTitle}>You Are Not Alone</Text>
          <Text style={styles.headerSub}>
            நீ இப்போ கஷ்டமான நேரத்துல இருக்க — help கேக்குறது strength!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌬️ Quick Breathing Exercise</Text>
          <Text style={styles.cardDesc}>
            4 seconds inhale → 4 seconds hold → 4 seconds exhale. 3 times பண்ணு!
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.btnText}>💬 AI கிட்ட பேசு</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>📞 Helplines — Free & Confidential</Text>
        {HELPLINES.map((line, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.helplineCard, { borderLeftColor: line.color }]}
            onPress={() => callHelpline(line.number)}
          >
            <View style={styles.helplineInfo}>
              <Text style={styles.helplineName}>{line.name}</Text>
              <Text style={styles.helplineDesc}>{line.desc}</Text>
            </View>
            <View style={[styles.callBtn, { backgroundColor: line.color }]}>
              <Text style={styles.callBtnText}>📞 Call</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.reminderCard}>
          <Text style={styles.reminderText}>
            💙 உன் feelings valid. Help கேக்குறது weakness இல்ல — இது courage!
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scroll: { padding: 20 },
  header: { backgroundColor: '#2C3E50', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  headerSub: { color: '#BDC3C7', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#7F8C8D', lineHeight: 22, marginBottom: 12 },
  btn: { backgroundColor: '#3498DB', borderRadius: 20, padding: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  helplineCard: {
    backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12,
    borderLeftWidth: 4, elevation: 2, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  helplineInfo: { flex: 1 },
  helplineName: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  helplineDesc: { fontSize: 12, color: '#7F8C8D', marginTop: 2 },
  callBtn: { borderRadius: 12, padding: 10, alignItems: 'center', marginLeft: 8 },
  callBtnText: { color: 'white', fontSize: 13, fontWeight: 'bold' },
  reminderCard: { backgroundColor: '#EBF5FB', borderRadius: 16, padding: 16, marginTop: 8, marginBottom: 20 },
  reminderText: { fontSize: 14, color: '#2980B9', textAlign: 'center', lineHeight: 22 },
});