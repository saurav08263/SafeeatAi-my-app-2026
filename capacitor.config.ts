import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.safeeat.ai',
  appName: 'SafeEat AI',

  server: {
    url: 'https://safeeat-ai-my-app-2026-zk15.vercel.app',
    cleartext: true,
  },

  android: {
    allowMixedContent: true,
  },
};

export default config;