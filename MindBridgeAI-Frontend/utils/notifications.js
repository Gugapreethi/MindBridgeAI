import { Platform } from 'react-native';

let Notifications = null;
let Device = null;

try {
  Notifications = require('expo-notifications');
  Device = require('expo-device');
} catch (e) {
  console.log('Notifications not available');
}

export const requestNotificationPermission = async () => {
  try {
    if (!Notifications || !Device) return false;
    if (!Device.isDevice) return false;

    const { status: existingStatus } = 
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('mindbridge', {
        name: 'MindBridge Reminders',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    return true;
  } catch (e) {
    console.log('Permission error:', e);
    return false;
  }
};

export const scheduleMorningReminder = async () => {
  try {
    if (!Notifications) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧠 MindBridge AI',
        body: 'காலை வணக்கம்! இன்னைக்கு mood check-in பண்ணினியா? 😊',
      },
      trigger: { hour: 8, minute: 0, repeats: true },
    });
  } catch (e) {
    console.log('Morning reminder error:', e);
  }
};

export const scheduleEveningReminder = async () => {
  try {
    if (!Notifications) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💙 MindBridge AI',
        body: 'மாலை வணக்கம்! இன்னைக்கு எப்படி இருந்தே? 🌙',
      },
      trigger: { hour: 20, minute: 0, repeats: true },
    });
  } catch (e) {
    console.log('Evening reminder error:', e);
  }
};

export const sendTestNotification = async () => {
  try {
    if (!Notifications) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧠 MindBridge AI',
        body: 'Notifications working! உன் daily companion ready 💙',
      },
      trigger: { seconds: 3 },
    });
  } catch (e) {
    console.log('Test notification error:', e);
  }
};

export const cancelAllNotifications = async () => {
  try {
    if (!Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.log('Cancel error:', e);
  }
};