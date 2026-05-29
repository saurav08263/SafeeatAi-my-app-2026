import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.safeeat.ai',
  appName: 'SafeEat AI',
  webDir: 'out',

  server: {
    url: 'https://safeeat-ai.vercel.app',
    cleartext: true,
  },

  android: {
    allowMixedContent: true,
    backgroundColor: '#0a1f0e',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a1f0e',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      spinnerColor: '#059669',
    },

    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a1f0e',
    },

    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#059669',
    },

    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },

    Camera: {
      presentationStyle: 'fullscreen',
    },
  },
};

export default config;