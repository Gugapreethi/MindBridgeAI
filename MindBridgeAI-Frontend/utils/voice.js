import * as Speech from 'expo-speech';

export const speakText = (text) => {
  Speech.speak(text, {
    language: 'en-IN',
    pitch: 1.0,
    rate: 0.9,
  });
};

export const stopSpeaking = () => {
  Speech.stop();
};