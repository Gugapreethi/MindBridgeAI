import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput,
  Alert, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGES = [
  { id: 'tamil', label: '🇮🇳 Tamil' },
  { id: 'english', label: '🇬🇧 English' },
  { id: 'hindi', label: '🇮🇳 Hindi' },
];

const USER_TYPES = [
  { id: 'student', label: '🎓 Student' },
  { id: 'professional', label: '💼 Professional' },
  { id: 'elder', label: '👴 Elder' },
  { id: 'homemaker', label: '🏠 Homemaker' },
  { id: 'teenager', label: '🧑 Teenager' },
];

export default function ProfileScreen({ userProfile, onUpdateProfile, onLogout }) {
  const [language, setLanguage] = useState(userProfile?.language || 'english');
  const [userType, setUserType] = useState(userProfile?.userType || 'student');
  const [familyName, setFamilyName] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [careNetwork, setCareNetwork] = useState([]);
  const [notifications, setNotifications] = useState(true);
  const [anonymous, setAnonymous] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(false);
  const [editingUserType, setEditingUserType] = useState(false);

  const saveProfile = () => {
    onUpdateProfile({ language, userType });
    Alert.alert('✅ Saved!', 'Profile updated successfully!');
  };

  const addCareNetwork = () => {
    if (!familyName.trim() || !familyPhone.trim()) {
      Alert.alert('Error', 'Name மற்றும் Phone number போடு!');
      return;
    }
    if (careNetwork.length >= 3) {
      Alert.alert('Limit', 'Maximum 3 contacts மட்டும் add பண்ணலாம்!');
      return;
    }
    setCareNetwork([...careNetwork, { name: familyName, phone: familyPhone }]);
    setFamilyName('');
    setFamilyPhone('');
    Alert.alert('✅ Added!', `${familyName} care network-ல add ஆனாங்க!`);
  };

  const removeCareNetwork = (index) => {
    Alert.alert(
      'Remove Contact',
      'இந்த contact-ஐ remove பண்றியா?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = careNetwork.filter((_, i) => i !== index);
            setCareNetwork(updated);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '🔄 Reset App',
      'எல்லா data-யும் delete ஆகும். Sure-ஆ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  const currentUserType = USER_TYPES.find(u => u.id === userType);
  const currentLanguage = LANGUAGES.find(l => l.id === language);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>
            {currentUserType?.label.split(' ')[0] || '👤'}
          </Text>
          <Text style={styles.headerName}>
            {currentUserType?.label.split(' ').slice(1).join(' ') || userType}
          </Text>
          <Text style={styles.headerLang}>
            {currentLanguage?.label || language}
          </Text>
          <View style={styles.privateBadge}>
            <Text style={styles.privateBadgeText}>🔒 Private & Secure</Text>
          </View>
        </View>

        {/* Language */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => setEditingLanguage(!editingLanguage)}
          >
            <Text style={styles.cardTitle}>🌐 Language / மொழி</Text>
            <Text style={styles.editBtn}>
              {editingLanguage ? 'Done ✓' : 'Change →'}
            </Text>
          </TouchableOpacity>

          <View style={styles.optionsRow}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.optionBtn,
                  language === lang.id && styles.optionBtnSelected,
                ]}
                onPress={() => setLanguage(lang.id)}
              >
                <Text style={[
                  styles.optionText,
                  language === lang.id && styles.optionTextSelected,
                ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* User Type */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeaderRow}
            onPress={() => setEditingUserType(!editingUserType)}
          >
            <Text style={styles.cardTitle}>👤 User Type</Text>
            <Text style={styles.editBtn}>
              {editingUserType ? 'Done ✓' : 'Change →'}
            </Text>
          </TouchableOpacity>

          {editingUserType && (
            <View style={styles.optionsGrid}>
              {USER_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.optionBtn,
                    userType === type.id && styles.optionBtnSelected,
                  ]}
                  onPress={() => setUserType(type.id)}
                >
                  <Text style={[
                    styles.optionText,
                    userType === type.id && styles.optionTextSelected,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!editingUserType && (
            <Text style={styles.currentValue}>{currentUserType?.label}</Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          <Text style={styles.saveBtnText}>💾 Save Profile</Text>
        </TouchableOpacity>

        {/* Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Settings</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>🔔 Daily Reminders</Text>
              <Text style={styles.settingDesc}>Mood check-in reminder</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#BDC3C7', true: '#3498DB' }}
              thumbColor="white"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>🕶️ Anonymous Mode</Text>
              <Text style={styles.settingDesc}>யாருக்கும் தெரியாம use பண்ணு</Text>
            </View>
            <Switch
              value={anonymous}
              onValueChange={setAnonymous}
              trackColor={{ false: '#BDC3C7', true: '#3498DB' }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Care Network */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 Care Network</Text>
          <Text style={styles.cardDesc}>
            Crisis-ல இந்த person-கு automatically alert போகும். உன் permission மட்டும்!
          </Text>

          {careNetwork.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View>
                <Text style={styles.contactName}>👤 {contact.name}</Text>
                <Text style={styles.contactPhone}>📞 {contact.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeCareNetwork(index)}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {careNetwork.length < 3 && (
            <View style={styles.addContact}>
              <TextInput
                style={styles.input}
                placeholder="Care person name (e.g. அம்மா)"
                value={familyName}
                onChangeText={setFamilyName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={familyPhone}
                onChangeText={setFamilyPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.addBtn} onPress={addCareNetwork}>
                <Text style={styles.addBtnText}>+ Add to Care Network</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>ℹ️ About</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Made with</Text>
            <Text style={styles.aboutValue}>💙 for India</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Privacy</Text>
            <Text style={styles.aboutValue}>100% Private</Text>
          </View>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🔄 Reset App</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  scroll: { padding: 20 },
  header: {
    backgroundColor: '#2C3E50',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerEmoji: { fontSize: 56, marginBottom: 8 },
  headerName: {
    color: 'white', fontSize: 22,
    fontWeight: 'bold', textTransform: 'capitalize',
    marginBottom: 4,
  },
  headerLang: { color: '#BDC3C7', fontSize: 14, textTransform: 'capitalize' },
  privateBadge: {
    backgroundColor: '#27AE60', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 10,
  },
  privateBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  card: {
    backgroundColor: 'white', borderRadius: 16,
    padding: 16, marginBottom: 16, elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  cardDesc: { fontSize: 13, color: '#7F8C8D', marginBottom: 12, lineHeight: 18 },
  editBtn: { fontSize: 14, color: '#3498DB', fontWeight: 'bold' },
  currentValue: { fontSize: 15, color: '#7F8C8D' },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    borderWidth: 1.5, borderColor: '#BDC3C7',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
  },
  optionBtnSelected: { borderColor: '#3498DB', backgroundColor: '#EBF5FB' },
  optionText: { fontSize: 13, color: '#7F8C8D' },
  optionTextSelected: { color: '#3498DB', fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#3498DB', borderRadius: 25,
    padding: 14, alignItems: 'center', marginBottom: 16,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 8,
  },
  settingLabel: { fontSize: 15, color: '#2C3E50', fontWeight: '600' },
  settingDesc: { fontSize: 12, color: '#7F8C8D', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#ECF0F1', marginVertical: 4 },
  contactCard: {
    backgroundColor: '#F8F9FA', borderRadius: 12,
    padding: 12, marginBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  contactName: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50' },
  contactPhone: { fontSize: 13, color: '#7F8C8D', marginTop: 2 },
  removeBtn: {
    backgroundColor: '#E74C3C', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  removeBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  addContact: { marginTop: 8 },
  input: {
    backgroundColor: '#F8F9FA', borderRadius: 12,
    padding: 12, fontSize: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#ECF0F1',
  },
  addBtn: {
    backgroundColor: '#2ECC71', borderRadius: 20,
    padding: 12, alignItems: 'center',
  },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  aboutCard: {
    backgroundColor: 'white', borderRadius: 16,
    padding: 16, marginBottom: 16, elevation: 2,
  },
  aboutTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  aboutRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8,
  },
  aboutLabel: { fontSize: 14, color: '#7F8C8D' },
  aboutValue: { fontSize: 14, color: '#2C3E50', fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#E74C3C', borderRadius: 25,
    padding: 14, alignItems: 'center', marginBottom: 40,
  },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});