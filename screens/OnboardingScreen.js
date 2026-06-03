import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';

const USER_TYPES = [
  { id: 'student', label: '🎓 Student', desc: 'Exam stress, peer pressure' },
  { id: 'professional', label: '💼 Professional', desc: 'Burnout, work pressure' },
  { id: 'elder', label: '👴 Elder', desc: 'Loneliness, daily companion' },
  { id: 'homemaker', label: '🏠 Homemaker', desc: 'Isolation, mental wellness' },
  { id: 'teenager', label: '🧑 Teenager', desc: 'Identity, social pressure' },
];

const LANGUAGES = [
  { id: 'tamil', label: '🇮🇳 Tamil' },
  { id: 'english', label: '🇬🇧 English' },
  { id: 'hindi', label: '🇮🇳 Hindi' },
];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [language, setLanguage] = useState(null);

  const handleNext = () => {
    if (step === 1 && userType) setStep(2);
    else if (step === 2 && language) onComplete({ userType, language });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>🧠 MindBridge AI</Text>
        <Text style={styles.stepText}>Step {step} of 2</Text>

        {step === 1 && (
          <View>
            <Text style={styles.question}>நீ யார்? Who are you?</Text>
            {USER_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.card, userType === type.id && styles.cardSelected]}
                onPress={() => setUserType(type.id)}
              >
                <Text style={styles.cardLabel}>{type.label}</Text>
                <Text style={styles.cardDesc}>{type.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.question}>மொழி தேர்வு Choose Language</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.id}
                style={[styles.card, language === lang.id && styles.cardSelected]}
                onPress={() => setLanguage(lang.id)}
              >
                <Text style={styles.cardLabel}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.nextBtn,
            (step === 1 && !userType) || (step === 2 && !language)
              ? styles.nextBtnDisabled : {},
          ]}
          onPress={handleNext}
          disabled={(step === 1 && !userType) || (step === 2 && !language)}
        >
          <Text style={styles.nextText}>
            {step === 2 ? '🚀 Start' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4FD' },
  scroll: { padding: 24 },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 4, marginTop: 20 },
  stepText: { textAlign: 'center', color: '#7F8C8D', marginBottom: 24, fontSize: 14 },
  question: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: 'white', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 2, borderColor: 'transparent', elevation: 2,
  },
  cardSelected: { borderColor: '#3498DB', backgroundColor: '#EBF5FB' },
  cardLabel: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  cardDesc: { fontSize: 13, color: '#7F8C8D', marginTop: 4 },
  nextBtn: {
    backgroundColor: '#3498DB', borderRadius: 25,
    padding: 16, alignItems: 'center', marginTop: 24, marginBottom: 40,
  },
  nextBtnDisabled: { backgroundColor: '#BDC3C7' },
  nextText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});