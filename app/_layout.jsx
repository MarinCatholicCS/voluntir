import { useEffect } from 'react'
import { Platform, View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AppProvider, useApp } from '../src/context/AppContext'
import { ConfirmModal, LoginModal, Toast } from '../src/components/Common'
import { ViewProfileModal } from '../src/components/pages/ProfilePage'
import { C } from '../src/constants'

function RootLayoutNav() {
  const {
    user, loading, toast,
    deleteTgt, setDeleteTgt, confirmDelete,
    showLoginModal, setShowLoginModal, doLogin, loginLoading, loginError,
    viewProfileUid, setViewProfileUid,
  } = useApp()

  const router = useRouter()
  const segments = useSegments()

  // Route based on auth state and platform
  useEffect(() => {
    if (loading) return

    const inApp = segments[0] === '(app)'
    const isWeb = Platform.OS === 'web'

    if (!user && isWeb && inApp) {
      // Web: redirect unauthenticated users to landing
      router.replace('/landing')
    } else if (!user && !isWeb && !inApp) {
      // Native: go straight to app (events visible without auth)
      router.replace('/(app)')
    } else if (user && !inApp) {
      // Authenticated: go to app
      router.replace('/(app)')
    }
  }, [user, loading, segments])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={C.greenAccent} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="landing" />
      </Stack>

      {/* Global overlays */}
      {deleteTgt && (
        <ConfirmModal
          title="Delete this listing?"
          message={`"${deleteTgt.title}" will be permanently removed and all sign-ups will be lost.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTgt(null)}
        />
      )}
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={doLogin}
        loginLoading={loginLoading}
        loginError={loginError}
      />
      {viewProfileUid && (
        <ViewProfileModal
          visible={!!viewProfileUid}
          uid={viewProfileUid}
          onClose={() => setViewProfileUid(null)}
        />
      )}
      <Toast message={toast} />
      <StatusBar style="dark" />
    </View>
  )
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.offWhite,
  },
  loadingText: {
    marginTop: 12, color: C.textMuted, fontSize: 15,
  },
})
