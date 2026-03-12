import { useState, useEffect } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { C } from '../../constants'
import { I } from '../Icons'
import EventCard from '../EventCard'
import EventDetail from '../EventDetail'
import { getTodayStr, rankListingsBySkills } from '../../utils'
import { useApp } from '../../context/AppContext'

export default function EventsPage() {
  const { user, profile, listings, signUp, unsign, setDeleteTgt, refresh, refreshing, requireLogin, confirmVolunteerHours, unconfirmVolunteerHours } = useApp()

  const [sel, setSel] = useState(null)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const today = getTodayStr()
  const upcoming = listings.filter(l => l.date >= today)
  const searched = upcoming.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    (l.organizer || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.location || '').toLowerCase().includes(search.toLowerCase())
  )

  const userSkills = profile && profile.skills && profile.skills.length > 0 ? profile.skills : null
  const [filtered, setFiltered] = useState(searched)

  useEffect(() => {
    let stale = false
    if (!userSkills) { setFiltered(searched); return }
    setFiltered(searched)
    rankListingsBySkills(searched, userSkills).then(ranked => { if (!stale) setFiltered(ranked) })
    return () => { stale = true }
  }, [listings, search, userSkills && userSkills.join(',')])

  const uid = user ? user.uid : null

  if (sel) {
    const li = listings.find(l => l.id === sel)
    if (li) return (
      <EventDetail
        listing={li}
        signedUp={uid ? (li.volunteers || []).includes(uid) : false}
        isOwner={uid ? li.createdBy === uid : false}
        onSignUp={uid ? signUp : requireLogin}
        onUnsign={uid ? unsign : requireLogin}
        onBack={() => setSel(null)}
        onDelete={l => { setDeleteTgt(l); setSel(null) }}
        onConfirmHours={confirmVolunteerHours}
        onUnconfirmHours={unconfirmVolunteerHours}
      />
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Volunteer Events</Text>
          <Text style={styles.subtitle}>Find opportunities to make a difference.</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={refresh}
          disabled={refreshing}
          activeOpacity={0.7}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={C.greenAccent} />
          ) : (
            <I.Refresh size={18} color={C.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, searchFocused && styles.searchInputFocused]}
          placeholder="Search events, organizations, or locations..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Event List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>
            {upcoming.length === 0 ? 'No upcoming events at the moment.' : 'No events match your search.'}
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filtered.map(l => (
            <EventCard
              key={l.id}
              listing={l}
              signedUp={uid ? (l.volunteers || []).includes(uid) : false}
              isOwner={uid ? l.createdBy === uid : false}
              onSignUp={uid ? signUp : requireLogin}
              onUnsign={uid ? unsign : requireLogin}
              onView={() => setSel(l.id)}
              onDelete={setDeleteTgt}
            />
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.offWhite,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 26,
    color: C.textPrimary,
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: C.textSecondary,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
    fontSize: 14,
    color: C.textPrimary,
  },
  searchInputFocused: {
    borderColor: C.greenAccent,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: C.textMuted,
    textAlign: 'center',
  },
  listContainer: {
    gap: 14,
  },
})
