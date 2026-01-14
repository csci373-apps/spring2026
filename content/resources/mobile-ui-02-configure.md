---
title: "Installation & Configuration"
group: "Mobile UI"
group_order: 5
order: 2
---

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18.17.0** (check with `node --version`)
  - If you need to install or switch versions, use `nvm` (Node Version Manager)
  - The project includes an `.nvmrc` file with the correct version
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

### Optional but Recommended

- **VS Code** or another code editor
- **Expo Go app** on your phone (iOS App Store or Google Play Store)
  - Allows you to test on a real device without building

## Installation

### 1. Clone and Navigate to the Project

```bash
# Navigate to the mobile directory
cd mobile

# Install dependencies
npm install
```

This installs all the required packages including:
- React Native
- Expo
- React Native Paper
- TypeScript
- And all other dependencies

### 2. Configure Environment Variables

Create a `.env` file in the `mobile/` directory:

```bash
# In the mobile/ directory
cp .env.example .env
```

Then open `.env` and uncomment the `EXPO_PUBLIC_API_URL` line:

```bash
# Uncomment and update this line:
EXPO_PUBLIC_API_URL=http://localhost:8000
```

**Important Notes:**
The backend of your mobile app is running on your local computer (FastAPI, typically in Docker). While you can access it at `http://localhost:8000` from your browser, mobile devices and emulators need to connect to the REST API differently:

- For the **Android emulator**: The script automatically uses `http://10.0.2.2:8000` (special IP to access host machine)
- For the **iOS simulator**: Uses `http://localhost:8000`
- For external **physical devices**, including your Expo App: You'll need to use your computer's local network IP address (e.g., `http://192.168.1.100:8000`)
- The project includes an auto-detection script that updates your `.env` file automatically by running:

  ```bash
  npm run update-ip
  ```

  Note that because your network IP address is dynamic, you may need to run this again when switching to a new network after disconnecting.

### 3. Verify Installation

Check that everything is installed correctly:

```bash
# Check Node version (should be 18.17.0)
node --version

# Check npm version
npm --version

# Check Expo CLI (installed as part of dependencies)
npx expo --version
```

## Setting Up Emulators

### Option 1: iOS Simulator (Mac Only)

**Prerequisites:**
- macOS with Xcode installed

**Steps:**

1. **Install Xcode** (if not already installed):
   ```bash
   # Install from App Store, or:
   xcode-select --install
   ```

2. **Install iOS Simulator:**
   - Xcode includes the iOS Simulator
   - Open Xcode → Preferences → Components
   - Download a simulator (e.g., iPhone 15, iOS 17)

3. **Start Expo and open iOS Simulator:**
   ```bash
   npx expo start
   ```
   Then press `i` to open the iOS Simulator. Expo will automatically launch the simulator and load your app.

### Option 2: Android Emulator (Windows, Mac, Linux)

For detailed setup instructions, see the [official Expo documentation for Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/).

**Quick Setup:**

1. **Install prerequisites:**
   - **macOS**: Install Watchman and JDK (Azul Zulu 17 recommended)
   - **Windows**: Install JDK (Microsoft OpenJDK 17 recommended)
   - **Linux**: Install Watchman and JDK (OpenJDK 17)

2. **Install and configure Android Studio:**
   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - Install Android SDK Platform 35 (Android 15) and Android SDK Build-Tools
   - Set up `ANDROID_HOME` environment variable
   - Verify `adb` works from terminal

3. **Create an Android Virtual Device (AVD):**
   - Open Android Studio → More Actions → Virtual Device Manager
   - Click "Create device"
   - Choose a device (e.g., Pixel 6)
   - Select Android 15 (VanillaIceCream) system image
   - Click "Finish"

4. **Start Expo and open Android Emulator:**
   ```bash
   npx expo start
   ```
   Then press `a` to open the Android Emulator. Expo will automatically launch the emulator and load your app.

**Note:** For complete setup instructions including environment variable configuration, troubleshooting, and platform-specific details, refer to the [Expo Android Studio Emulator guide](https://docs.expo.dev/workflow/android-studio-emulator/).

### Option 3: Physical Device (Easiest to Start!)

You can test on your actual phone without setting up emulators:

1. **Install Expo Go on your mobile device:**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start Expo on your computer (from the terminal):**
   ```bash
   npx expo start
   ```

3. **Connect your phone:**: Scan the QR code that appears in the terminal

4. **Make sure your phone and computer are on the same Wi-Fi network**

**Note:** For physical devices, you'll need to update `EXPO_PUBLIC_API_URL` in `.env` to your computer's IP address. Remember, the project includes a script that does this for you:

```bash
npm run update-ip
```

## Running the App

### Development Server

Start the Expo development server:

```bash
npx expo start
```

This:
- Starts the Metro bundler (packages your JavaScript)
- Shows a QR code for Expo Go
- Provides options to open in simulator/emulator

### What You'll See

When you run `npx expo start`, you'll see:

```bash
> Metro waiting on exp://192.168.1.100:8081
> Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

> Press a | open Android
> Press i | open iOS simulator
> Press w | open web

> Press r | reload app
> Press m | toggle menu
> Press ? | show all commands
```

## Project Structure

```bash
mobile/
├── app/                            # Expo Router - file-based routing
│   ├── (auth)/                     # Authentication screens
│   │   ├── login.tsx               # Login screen
│   │   └── home.tsx                # Post-login home
│   ├── (tabs)/                     # Tab navigation screens
│   │   ├── home.tsx                # Home tab
│   │   ├── groups.tsx              # Groups tab
│   │   ├── groups/[id].tsx         # Group detail
│   │   ├── courses.tsx             # Courses tab
│   │   ├── courses/[id].tsx        # Course detail
│   │   ├── modules/[id].tsx        # Module detail
│   │   ├── posts/[id].tsx          # Post viewing
│   │   ├── files/[id].tsx          # File viewing
│   │   ├── quizzes/[id]/take.tsx   # Quiz taking
│   │   ├── progress.tsx            # Progress tracking
│   │   ├── profile.tsx             # User profile
│   │   └── _layout.tsx             # Tab layout
│   ├── index.tsx                   # Root redirect
│   └── _layout.tsx                 # Root layout
├── components/                     # Reusable components
│   ├── ErrorBoundary.tsx           # Error handling
│   ├── ProtectedRoute.tsx          # Route protection
│   └── InfoBadge.tsx               # Info display
├── contexts/                       # React contexts
│   └── AuthContext.tsx            # Authentication state
├── services/                       # API service layer
│   ├── api.ts                      # API client (axios setup)
│   ├── users.ts                    # User API calls
│   ├── groups.ts                   # Groups API calls
│   ├── courses.ts                  # Courses API calls
│   ├── posts.ts                    # Posts API calls
│   └── progress.ts                 # Progress API calls
├── types/                          # TypeScript type definitions
│   ├── api.ts                      # API response types
│   └── index.ts                    # Shared types
├── utils/                          # Utility functions
│   ├── __tests__/                  # Unit tests
│   │   ├── storage.test.ts
│   │   └── typeGuards.test.ts
│   ├── storage.ts                  # Storage helpers (SecureStore/localStorage)
│   └── typeGuards.ts               # Type conversion utilities
├── scripts/                        # Helper scripts
│   ├── update-env-ip.sh            # Auto-detect and update IP
│   ├── find-ip.sh                  # Find local IP address
│   └── ensure-emulator.sh          # Emulator setup helpers
├── assets/                         # Images and static assets
├── theme.ts                        # React Native Paper theme
├── jest.config.js                  # Jest testing configuration
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── .env                            # Environment variables (create from .env.example)
```

## Common Commands

```bash
# Start development server
npx expo start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests verbosely
npm run test:verbose

# Type check
npx tsc --noEmit
```

## Type Checking

TypeScript helps catch errors before you run your code. The command `npx tsc --noEmit` checks your TypeScript code for type errors without generating JavaScript files.

**What it does:**
- Reads all `.ts` and `.tsx` files
- Checks that types match (e.g., if you say a variable is a `string`, it must be a string)
- Verifies that properties exist on objects
- Ensures functions are called with the correct arguments
- Reports errors without building the app

**Common errors you might see:**

1. **Property doesn't exist:**
   ```
   error TS2339: Property 'file_url' does not exist on type 'Course'
   ```
   This means the `Course` type doesn't have a `file_url` property, but your code is trying to use it.

2. **Missing type export:**
   ```
   error TS2305: Module '"../types"' has no exported member 'Module'
   ```
   This means you're trying to import a type that doesn't exist or isn't exported.

3. **Implicit 'any' type:**
   ```
   error TS7006: Parameter 'a' implicitly has an 'any' type
   ```
   TypeScript can't figure out what type a variable should be. You need to add a type annotation.

**Fixing type errors:**
- Add missing properties to type definitions in `types/api.ts`
- Export missing types from `types/index.ts`
- Add type annotations to function parameters

## Troubleshooting

### "Cannot find module" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Metro bundler cache issues

```bash
# Clear cache and restart
npx expo start -- --reset-cache
```

### iOS Simulator not opening

- Make sure Xcode is installed: `xcode-select -p`
- Open Simulator manually: `open -a Simulator`
- Then run `npx expo start` and press `i`

### Android Emulator not found

- Make sure Android Studio is installed
- Make sure an AVD is created in Android Studio
- Check that `ANDROID_HOME` is set (usually set automatically by Android Studio)
- Try starting the emulator from Android Studio first, then run `npx expo start` and press `a`

### "Network request failed" on physical device

- Make sure your phone and computer are on the same Wi-Fi network
- Update `EXPO_PUBLIC_API_URL` in `.env` to your computer's IP address
- The project includes a script (`npm run update-ip`) that does this automatically!

### Port already in use

If port 8081 (Metro bundler) is already in use:

```bash
# Kill the process using the port
# Mac/Linux:
lsof -ti:8081 | xargs kill -9

# Then restart
npx expo start
```

### TypeScript errors

```bash
# Check for type errors
npx tsc --noEmit

# If errors persist, try:
rm -rf node_modules
npm install
```

## Next Steps

Once you have the app running:

1. **Explore the codebase** - Look at `app/(tabs)/index.tsx` to see a simple screen
2. **Read the React Native intro** - Understand the differences from web React
3. **Check out React Native Paper** - See what components are available
4. **Start building** - Create your first screen or component!

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Paper Components](https://callstack.github.io/react-native-paper/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
