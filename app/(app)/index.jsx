import { SafeAreaView, StyleSheet } from 'react-native'
import EventsPage from '../../src/components/pages/EventsPage'
import { C } from '../../src/constants'

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EventsPage />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },
})
