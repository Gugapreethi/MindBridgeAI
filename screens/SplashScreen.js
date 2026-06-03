import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => onFinish(), 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }]}>
        <Text style={styles.emoji}>🧠</Text>
        <Text style={styles.title}>MindBridge AI</Text>
        <Text style={styles.subtitle}>Everyone deserves someone to talk to</Text>
      </Animated.View>
      <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
        💙 Safe • Private • Always Here
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#3498DB',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { alignItems: 'center' },
  emoji: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#D6EAF8', textAlign: 'center', paddingHorizontal: 40 },
  footer: { position: 'absolute', bottom: 40, color: '#D6EAF8', fontSize: 14 },
});