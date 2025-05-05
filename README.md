# Pixel Fantasy Steps

A gamified step counter app that turns your daily steps into a fantasy RPG adventure. Level up your character, complete daily quests, and unlock achievements as you walk!

## Features

- Step counting with pedometer integration
- Character level progression system
- Daily quests with rewards
- Character customization (appearance and class)
- Achievement system
- Persistent data storage

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd PixelFantasySteps
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## Project Structure

```
PixelFantasySteps/
├── src/
│   ├── components/
│   │   ├── StepTracker.tsx
│   │   ├── CharacterLevel.tsx
│   │   ├── DailyQuests.tsx
│   │   ├── Achievements.tsx
│   │   ├── CharacterCustomization.tsx
│   │   └── CharacterAppearance.tsx
│   └── ...
├── App.tsx
├── index.js
├── package.json
└── tsconfig.json
```

## Technologies Used

- React Native
- Expo
- TypeScript
- AsyncStorage for data persistence
- Expo Sensors for pedometer functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 