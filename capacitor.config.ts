import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.safeeat.ai',
  appName: 'SafeEat AI',

  server: {
    url: 'https://safeeat-ai-my-app-2026-ow3h1xtxi.vercel.app',
    cleartext: true,
  },

  android: {
    allowMixedContent: true,
  },
};

export default config;