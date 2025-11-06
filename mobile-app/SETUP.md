# SPL HOMES Mobile App - Setup Guide

## Initial Setup (First Time)

1. **Install Expo CLI globally** (optional, but recommended):
   ```bash
   npm install -g expo-cli
   ```

2. **Navigate to mobile-app folder:**
   ```bash
   cd mobile-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open on your phone:**
   - Install **Expo Go** from App Store (iOS) or Play Store (Android)
   - Scan the QR code shown in terminal
   - The app will load on your device

## Testing on Simulators/Emulators

### iOS Simulator (Mac only)
- Install Xcode from App Store
- Open Simulator: `npm run ios` or press `i` in Expo terminal

### Android Emulator
- Install Android Studio
- Create a virtual device in AVD Manager
- Run: `npm run android` or press `a` in Expo terminal

## Creating App Icons

1. Create a 1024x1024px PNG icon
2. Save as `assets/icon.png`
3. For Android adaptive icon, save as `assets/adaptive-icon.png`
4. Run `npx expo prebuild` to generate native assets

## Building Standalone Apps

### Using EAS Build (Recommended)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   eas login
   ```

3. **Configure:**
   ```bash
   eas build:configure
   ```

4. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

5. **Build for Android:**
   ```bash
   eas build --platform android
   ```

### Using Expo Build Service (Legacy)

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## Environment Variables

Create `.env` file:
```
API_URL=https://your-api.com
CONTACT_EMAIL=info@splhomes.com
```

Use with `expo-constants` or `react-native-dotenv`.

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules
npm install
```

### Metro bundler won't start
```bash
npx expo start --clear
```

### iOS build fails
```bash
cd ios && pod install && cd ..
```

### Android build fails
```bash
cd android && ./gradlew clean && cd ..
```

## Next Steps

- [ ] Add real app icons
- [ ] Configure app store listings
- [ ] Set up push notifications
- [ ] Add analytics
- [ ] Test on real devices
- [ ] Submit to app stores

