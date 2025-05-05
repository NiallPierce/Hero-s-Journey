import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StepTracker } from './src/components/StepTracker';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StepTracker />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
