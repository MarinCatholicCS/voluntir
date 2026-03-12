import { SafeAreaView, StyleSheet } from 'react-native'
import LeaderboardPage from '../../src/components/pages/LeaderboardPage'
import { C } from '../../src/constants'

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LeaderboardPage />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },
})
