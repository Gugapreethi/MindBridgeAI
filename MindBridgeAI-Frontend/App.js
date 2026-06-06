import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import MoodTrackerScreen from './screens/MoodTrackerScreen';
import CrisisScreen from './screens/CrisisScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!userProfile) {
    return (
      <OnboardingScreen onComplete={(profile) => setUserProfile(profile)} />
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3498DB',
          tabBarInactiveTintColor: '#95A5A6',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#ECF0F1',
            height: 60,
            paddingBottom: 8,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🏠</Text>
            ),
          }}
        >
          {(props) => <HomeScreen {...props} userProfile={userProfile} />}
        </Tab.Screen>

        <Tab.Screen
          name="Chat"
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>💬</Text>
            ),
          }}
        >
          {(props) => (
            <ChatScreen {...props} userProfile={userProfile} onBack={() => {}} />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Mood"
          options={{
            tabBarLabel: 'Mood',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>📊</Text>
            ),
          }}
        >
          {(props) => <MoodTrackerScreen {...props} onOpenChat={() => {}} />}
        </Tab.Screen>

        <Tab.Screen
          name="Crisis"
          options={{
            tabBarLabel: 'Help',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>💙</Text>
            ),
          }}
        >
          {(props) => <CrisisScreen {...props} />}
        </Tab.Screen>

        <Tab.Screen
          name="Profile"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>👤</Text>
            ),
          }}
        >
          {(props) => (
            <ProfileScreen
              {...props}
              userProfile={userProfile}
              onUpdateProfile={(updated) =>
                setUserProfile({ ...userProfile, ...updated })
              }
              onLogout={() => setUserProfile(null)}
            />
          )}
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  );
}