---
title: "Deploying"
group: "Mobile UI"
group_order: 5
order: 6
---

This guide covers deploying your Expo app using **EAS (Expo Application Services) CLI**. EAS allows you to:

- Build native apps for iOS and Android
- Create preview builds for testing
- Publish updates over-the-air (OTA)
- Submit apps to app stores

## Prerequisites

- An Expo account (free at [expo.dev](https://expo.dev))
- EAS CLI installed
- Your app configured in `app.json` or `app.config.js`

## Installation

### 1. Check if EAS CLI is Already Installed

First, check if you already have EAS CLI installed:

```bash
eas --version
```

If you see a version number (e.g., `5.0.0`), EAS CLI is already installed and you can skip to the next step. If you get a "command not found" error, proceed to install it.

### 2. Install EAS CLI

If EAS CLI is not installed, install it globally:

```bash
npm install -g eas-cli
```

Or use `npx` without global installation (no install needed):

```bash
npx eas-cli --version
```

**Note:** Using `npx` doesn't require installation, but you'll need to use `npx eas-cli` for every command instead of just `eas`.

### 3. Login to Expo

```bash
eas login
```

This will prompt you to:
- Enter your Expo account email
- Enter your password
- Or open a browser to authenticate

If you don't have an account, create one at [expo.dev/signup](https://expo.dev/signup).

### 4. Navigate to Your Project

Navigate to your mobile project directory:

```bash
cd mobile
```

**Note:** The project is already configured with `eas.json` and `app.json` files, so you don't need to run `eas init` or manually configure these files.

## Configuration

The project already includes the necessary configuration files:

### EAS Configuration (`eas.json`)

The `eas.json` file is already configured with three build profiles:

- **development**: For development builds with Expo Dev Client
  - Includes simulator builds for iOS
  - Uses development API URL (`https://dev.tma.unca.info`)
  
- **preview**: For testing on physical devices (not app stores)
  - Creates installable `.apk` files for Android
  - Uses development API URL
  
- **production**: For app store submissions
  - Creates production builds
  - Uses production API URL (`https://tma.unca.info`)

All profiles are configured with Node.js 20.18.0 and the appropriate environment variables.

### App Configuration (`app.json`)

The `app.json` file is already configured with:
- App name, slug, and version
- iOS bundle identifier and Android package name
- Icon and splash screen settings
- Expo project ID (already linked to expo.dev)

You can modify these settings if needed, but the defaults are ready for deployment.

## Building Your App

### Preview Build (For Testing)

Create a preview build for testing on physical devices:

**For Android:**
```bash
eas build --platform android --profile preview
```

**For iOS:**
```bash
eas build --platform ios --profile preview
```

**For both platforms:**
```bash
eas build --platform all --profile preview
```

**What happens:**
1. EAS uploads your code to Expo's servers
2. Builds your app in the cloud
3. Provides a download link when complete
4. You can install the `.apk` (Android) or `.ipa` (iOS) on your device

**Note:** For iOS, you'll need an Apple Developer account ($99/year) to install on physical devices. For Android, you can install the `.apk` directly.

### Production Build (For App Stores)

When ready to submit to app stores:

```bash
eas build --platform all --profile production
```

This creates builds ready for:
- **iOS**: App Store submission
- **Android**: Google Play Store submission

## Publishing Updates (OTA)

After building your app, you can push JavaScript updates without rebuilding using **OTA (Over-The-Air) updates**. This allows you to update your app's JavaScript code without going through the app store review process.

### When to Use OTA Updates

OTA updates are appropriate for:
- **JavaScript/TypeScript code changes** - Bug fixes, new features, UI improvements
- **React Native component updates** - Changes to your React components and screens
- **Business logic updates** - Changes to how your app processes data
- **Styling changes** - Updates to colors, layouts, fonts
- **Configuration changes** - API endpoints, feature flags
- **Quick bug fixes** - Fixing issues without waiting for app store approval

### When You Need a New Build

You **must create a new build** (not just an OTA update) when you:
- **Change native dependencies** - Adding or updating packages that include native code (e.g., `expo-camera`, `expo-location`, native modules)
- **Modify `app.json` or `app.config.js`** - Changes to app name, version, bundle identifier, icons, splash screens, permissions
- **Update Expo SDK version** - Upgrading to a new Expo SDK requires a new build
- **Change native code** - Any modifications to iOS (Swift/Objective-C) or Android (Java/Kotlin) code
- **Add new permissions** - New camera, location, or other device permissions require a new build
- **Change app version** - Incrementing the version number in `app.json` typically requires a new build
- **Update native build tools** - Changes to build configuration in `eas.json` that affect native compilation

### How OTA Updates Work

1. **Publish an Update**

   ```bash
   eas update --branch production --message "Bug fixes and improvements"
   ```

   This publishes your latest JavaScript bundle to all users with the production build. Users will receive the update automatically the next time they open the app (if they have an internet connection).

2. **View Update Status**

   ```bash
   eas update:list
   ```

   Shows all published updates and their status, including which users have received the update.

3. **Rollback an Update**

   If an update causes issues:

   ```bash
   eas update:rollback
   ```

   This reverts to the previous update, allowing you to quickly fix problems without creating a new build.

### Best Practices

- **Test updates thoroughly** before publishing to production
- **Use branches** to test updates on development/preview builds before pushing to production
- **Monitor update status** to ensure users are receiving updates
- **Keep builds up to date** - OTA updates only work for users who have a compatible build installed
- **Version your updates** - Use descriptive messages to track what changed in each update

## Submitting to App Stores

### iOS App Store

1. **Build for production:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

   This will:
   - Ask for your Apple ID credentials
   - Upload your app to App Store Connect
   - Start the App Store review process

### Google Play Store

1. **Build for production:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Play Store:**
   ```bash
   eas submit --platform android
   ```

   This will:
   - Ask for your Google Play credentials
   - Upload your app to Google Play Console
   - Start the Play Store review process

## Environment Variables

For production builds, set environment variables in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.yourapp.com"
      }
    }
  }
}
```

Or use EAS secrets for sensitive values:

```bash
eas secret:create --name EXPO_PUBLIC_API_URL --value https://api.yourapp.com --scope project
```

## Common Commands

```bash
# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]

# Cancel a build
eas build:cancel [BUILD_ID]

# Download a build
eas build:download [BUILD_ID]

# View project info
eas project:info

# Update EAS CLI
npm install -g eas-cli@latest
```

## Resources

- [EAS CLI Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo Dashboard](https://expo.dev) - View builds, updates, and analytics
