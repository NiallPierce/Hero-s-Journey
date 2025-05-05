import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { StepTracker } from './src/components/StepTracker';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <StepTracker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
