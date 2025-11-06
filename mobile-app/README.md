# SPL HOMES - Expo React Native App

A native mobile app for SPL HOMES built with Expo and React Native, featuring a modern UI with bottom tab navigation.

## Features

- 🏠 **Home Screen** - Hero section, services overview, and trust badges
- 📊 **Projects Screen** - Filterable project listings (Current, New/For Sale, Completed)
- 🎨 **Design Screen** - Interactive Planner 5D, Floorplanner, and SketchUp embeds
- ℹ️ **About Screen** - Company information and statistics
- 📧 **Contact Screen** - Contact information and inquiry form

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli` or use `npx expo`
- **Expo Go app** on your phone (iOS App Store or Google Play Store) for testing

## Quick Start

1. **Navigate to the mobile app directory:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Expo development server:**
   ```bash
   npm start
   # or
   yarn start
   # or
   npx expo start
   ```

4. **Run on your device:**
   - Scan the QR code with Expo Go (iOS) or Camera app (Android)
   - Or press `i` for iOS Simulator, `a` for Android Emulator

## Running on Different Platforms

### iOS Simulator (Mac only)
```bash
npm run ios
# or
npx expo start --ios
```

### Android Emulator
```bash
npm run android
# or
npx expo start --android
```

### Web Browser
```bash
npm run web
# or
npx expo start --web
```

## Project Structure

```
mobile-app/
├── App.js                 # Main app entry with navigation
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── src/
│   └── screens/
│       ├── HomeScreen.js      # Home with hero and services
│       ├── ProjectsScreen.js   # Project listings with filters
│       ├── DesignScreen.js     # Design tool embeds
│       ├── AboutScreen.js      # About page
│       └── ContactScreen.js    # Contact form
└── README.md
```

## Customization

### Update Project Data

Edit `src/screens/ProjectsScreen.js` to update project listings:

```javascript
const projects = [
  {
    id: 'prj-1',
    title: 'Your Project',
    status: 'current', // 'current' | 'new' | 'completed'
    location: 'Location',
    area: 'Area',
    price: 'Price',
    image: 'image-url',
  },
];
```

### Update Contact Information

Edit `src/screens/ContactScreen.js`:

```javascript
const contactInfo = [
  {
    icon: 'phone',
    label: 'Phone',
    value: '+1 234 567 890',
    action: () => Linking.openURL('tel:+1234567890'),
  },
];
```

### Change App Icons and Splash Screen

1. Replace `assets/icon.png` (1024x1024px)
2. Replace `assets/splash.png` (1242x2436px)
3. Replace `assets/adaptive-icon.png` (Android, 1024x1024px)

Then run:
```bash
npx expo prebuild
```

## Building for Production

### Build for iOS (requires Apple Developer account)

```bash
eas build --platform ios
```

Or use Expo's build service:
```bash
npx expo build:ios
```

### Build for Android

```bash
eas build --platform android
```

Or:
```bash
npx expo build:android
```

### Install EAS CLI (for building)

```bash
npm install -g eas-cli
eas login
```

## Publishing to App Stores

### iOS App Store

1. Configure in `app.json`:
   ```json
   "ios": {
     "bundleIdentifier": "com.splhomes.app"
   }
   ```

2. Build and submit:
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

### Google Play Store

1. Configure in `app.json`:
   ```json
   "android": {
     "package": "com.splhomes.app"
   }
   ```

2. Build and submit:
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

## Development Tips

### Clear Cache
```bash
npx expo start -c
```

### View Logs
```bash
npx expo start --dev-client
```

### Update Dependencies
```bash
npx expo install --fix
```

## Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### Module not found errors
```bash
rm -rf node_modules
npm install
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

## Dependencies

- **Expo** - Development platform and tooling
- **React Navigation** - Bottom tab navigation
- **Expo Vector Icons** - Material icons
- **React Native WebView** - For Planner 5D and design tool embeds
- **React Native Safe Area Context** - Safe area handling
- **Expo Web Browser** - For opening external links

## Next Steps

1. **Add app icons** - Replace placeholder icons in `assets/`
2. **Configure app name** - Update `app.json`
3. **Add splash screen** - Replace `assets/splash.png`
4. **Set up push notifications** - Use Expo Notifications
5. **Add analytics** - Integrate Firebase Analytics
6. **Test on devices** - Use Expo Go or build standalone apps

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Snack](https://snack.expo.dev/) - Online editor for testing

## Support

For Expo documentation, visit: https://docs.expo.dev/
