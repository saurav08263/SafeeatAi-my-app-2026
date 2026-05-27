import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.safeeat.ai',
  appName: 'SafeEat AI',
  webDir: "out",

  // Server URL — points to your deployed Next.js app
  // All API routes, AI analysis, and database work through this server
  // When deploying, change this to your production URL (e.g., https://safeeat.ai)
  server: {
     url: "http://192.168.1.10:3000", // Android emulator → host localhost
    // For physical device testing, use your computer's LAN IP:
    // url: 'http://192.168.x.x:3000',
    // For production, use your deployed URL:
    // url: 'https://safeeat.ai',
    cleartext: true, // Allow HTTP (needed for local dev)
    androidScheme: 'https',
  },

  // Android-specific configuration
  android: {
    allowMixedContent: true,
    backgroundColor: '#0a1f0e',
    // Use local web assets as fallback when server is unreachable
    // This provides offline capability with the out/ directory content
  },

  // Plugins configuration
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
