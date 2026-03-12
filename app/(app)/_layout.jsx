import { Tabs } from 'expo-router'
import { Platform } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useApp } from '../../src/context/AppContext'
import { C } from '../../src/constants'

export default function AppLayout() {
  const { user } = useApp()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.greenDark,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: {
          backgroundColor: C.white,
          borderTopColor: C.borderLight,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-listings"
        options={{
          title: 'Listings',
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />,
          href: user ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Board',
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <Feather name="plus" size={size} color={color} />,
          href: user ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
          href: user ? undefined : null,
        }}
      />
    </Tabs>
  )
}
