import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shivaestate.investorportal',
  appName: 'Shiva Estate Investor Portal',
  webDir: 'out',
  server: {
    url: 'https://shiva-estate-investor-portal.vercel.app',
    allowNavigation: [
      'shiva-estate-investor-portal.vercel.app'
    ]
  }
};

export default config;
