import { SafeAreaView, StyleSheet } from 'react-native'
import CreateListingPage from '../../src/components/pages/CreateListingPage'
import { C } from '../../src/constants'

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CreateListingPage />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },
})
