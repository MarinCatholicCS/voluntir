import { SafeAreaView, StyleSheet } from 'react-native'
import MyListingsPage from '../../src/components/pages/MyListingsPage'
import { C } from '../../src/constants'

export default function MyListingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MyListingsPage />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },
})
