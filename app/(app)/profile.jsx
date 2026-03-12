import { SafeAreaView, StyleSheet } from 'react-native'
import ProfilePage from '../../src/components/pages/ProfilePage'
import { C } from '../../src/constants'

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfilePage />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },
})
