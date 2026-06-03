import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import { detectCrisis } from './CrisisScreen';

const GROQ_API_KEY = 'உன்_key_இங்க_போடு';

export default function ChatScreen({ userProfile, onBack, navigation }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: userProfile.language === 'tamil'
        ? `வணக்கம்! நான் உன் MindBridge AI companion. இன்னைக்கு எப்படி இருக்க? 😊`
        : `Hello! I'm your MindBridge AI companion. How are you feeling today? 😊`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const getSystemPrompt = () => {
    return `You are MindBridge AI, a warm and empathetic mental health companion. 
    User type: ${userProfile.userType}. 
    Language: ${userProfile.language === 'tamil' ? 'Respond in Tamil' : 'Respond in English'}.
    Be supportive, non-judgmental, and caring.
    If user shows signs of crisis, gently suggest professional help.
    Keep responses short and conversational.`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    if (detectCrisis(input)) {
      Alert.alert(
        '💙 நான் இருக்கேன்',
        'உன்னோட feelings புரியுது. Professional help கிடைக்கும் — helplines பாக்கணுமா?',
        [
          { text: 'No, I am okay', style: 'cancel' },
          { text: 'Yes, show helplines', onPress: () => navigation.navigate('Crisis') },
        ]
      );
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...updatedMessages,
          ],
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiReply = response.data.choices[0].message.content;
      setMessages([...updatedMessages, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again! 🙏',
      }]);
    }

    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>🧠 MindBridge AI</Text>
        <Text style={styles.headerSub}>{userProfile.userType} • {userProfile.language}</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.aiText]}>
              {msg.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.aiBubble}>
            <ActivityIndicator size="small" color="#3498DB" />
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: { backgroundColor: '#3498DB', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, alignItems: 'center' },
  backBtn: { position: 'absolute', left: 16, top: 50 },
  backText: { color: 'white', fontSize: 16 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#D6EAF8', fontSize: 12, marginTop: 2 },
  messages: { flex: 1 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12, marginBottom: 10 },
  aiBubble: { backgroundColor: 'white', alignSelf: 'flex-start', elevation: 1 },
  userBubble: { backgroundColor: '#3498DB', alignSelf: 'flex-end' },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: '#2C3E50' },
  userText: { color: 'white' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: 'white', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ECF0F1' },
  input: { flex: 1, backgroundColor: '#F8F9FA', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn: { backgroundColor: '#3498DB', borderRadius: 25, width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendText: { color: 'white', fontSize: 18 },
});