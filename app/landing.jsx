import { Platform } from 'react-native'
import { Redirect } from 'expo-router'
import LandingPage from '../src/components/pages/LandingPage'
import { useApp } from '../src/context/AppContext'

export default function LandingScreen() {
  const { user, setShowLoginModal } = useApp()

  // Native: skip landing page entirely
  if (Platform.OS !== 'web') {
    return <Redirect href="/(app)" />
  }

  // Web: if already authenticated, go to app
  if (user) {
    return <Redirect href="/(app)" />
  }

  return (
    <LandingPage
      onLogin={() => setShowLoginModal(true)}
      onBrowse={() => {
        // Navigate to events without auth
      }}
    />
  )
}
