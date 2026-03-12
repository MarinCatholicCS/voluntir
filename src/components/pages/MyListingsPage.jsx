import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { C } from '../../constants'
import { I } from '../Icons'
import { ProgressBar } from '../Common'
import EventDetail from '../EventDetail'
import { getTodayStr, formatDate, btnStyle } from '../../utils'
import { useApp } from '../../context/AppContext'

export default function MyListingsPage() {
  const { user, listings, unsign, setDeleteTgt, signUp, requireLogin, confirmVolunteerHours, unconfirmVolunteerHours } = useApp()

  const [sel, setSel] = useState(null)

  const today = getTodayStr()
  const uid = user ? user.uid : null
  const mine = listings.filter(l => l.createdBy === uid)
  const upcoming = listings.filter(l => (l.volunteers || []).includes(uid) && l.date >= today)

  // If an event is selected, show its detail
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
        <Text style={styles.title}>My Listings</Text>
        <Text style={styles.subtitle}>Your signed-up events and posted listings.</Text>
      </View>

      {/* Upcoming Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>

        {upcoming.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌱</Text>
            <Text style={styles.emptyTitle}>No upcoming events yet</Text>
            <Text style={styles.emptySubtitle}>Browse events and sign up to start volunteering!</Text>
          </View>
        ) : (
          <View style={styles.listGap}>
            {upcoming.map(l => (
              <TouchableOpacity
                key={l.id}
                style={styles.upcomingCard}
                onPress={() => setSel(l.id)}
                activeOpacity={0.7}
              >
                <View style={styles.upcomingRow}>
                  {/* Calendar Icon */}
                  <View style={styles.calendarIcon}>
                    <I.Calendar size={22} color={C.greenDark} />
                  </View>

                  {/* Info */}
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingTitle} numberOfLines={1}>{l.title}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <I.Calendar size={12} color={C.textMuted} />
                        <Text style={styles.metaText}>{formatDate(l.date)}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <I.Clock size={12} color={C.textMuted} />
                        <Text style={styles.metaText}>{l.time}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <I.MapPin size={12} color={C.textMuted} />
                        <Text style={styles.metaText} numberOfLines={1}>{l.location}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.upcomingActions}>
                  <View style={styles.confirmedBadge}>
                    <I.Check size={12} color={C.white} />
                    <Text style={styles.confirmedText}>Confirmed</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={(e) => { unsign(l.id) }}
                    activeOpacity={0.7}
                  >
                    <I.X size={14} color={C.textMuted} />
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* My Posted Listings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Posted Listings</Text>

        {mine.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptySubtitle}>Head to Create to post your first volunteer opportunity!</Text>
          </View>
        ) : (
          <View style={styles.listGap}>
            {[...mine].sort((a, b) => {
              const aPast = a.date < today
              const bPast = b.date < today
              if (aPast !== bPast) return aPast ? 1 : -1
              return a.date.localeCompare(b.date)
            }).map(l => {
              const pct = Math.round((l.currentVolunteers / l.volunteersNeeded) * 100)
              const full = l.currentVolunteers >= l.volunteersNeeded
              const isPast = l.date < today

              return (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.createdCard, isPast && styles.createdCardPast]}
                  onPress={() => setSel(l.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.createdHeader}>
                    <View style={styles.createdInfo}>
                      <View style={styles.createdMeta}>
                        <Text style={styles.organizerText}>{l.organizer}</Text>
                        {isPast && (
                          <View style={styles.pastBadge}>
                            <Text style={styles.pastBadgeText}>Past Event</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.createdTitle} numberOfLines={2}>{l.title}</Text>

                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <I.Calendar size={12} color={C.textMuted} />
                          <Text style={styles.metaText}>{formatDate(l.date)}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <I.Clock size={12} color={C.textMuted} />
                          <Text style={styles.metaText}>{l.time}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <I.MapPin size={12} color={C.textMuted} />
                          <Text style={styles.metaText} numberOfLines={1}>{l.location}</Text>
                        </View>
                      </View>

                      {/* Progress */}
                      <View style={styles.progressContainer}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressText}>
                            <Text style={styles.progressCount}>{l.currentVolunteers}</Text> / {l.volunteersNeeded} volunteers
                          </Text>
                          <Text style={[styles.progressPct, full && styles.progressPctFull]}>
                            {full ? 'Full!' : `${pct}%`}
                          </Text>
                        </View>
                        <ProgressBar current={l.currentVolunteers} total={l.volunteersNeeded} />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => setDeleteTgt(l)}
                      activeOpacity={0.7}
                    >
                      <I.Trash size={16} color={C.textMuted} />
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>
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
    marginBottom: 22,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: C.textPrimary,
    marginBottom: 14,
  },
  listGap: {
    gap: 14,
  },
  // Empty state
  emptyCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
    marginBottom: 7,
  },
  emptySubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    textAlign: 'center',
  },
  // Upcoming cards
  upcomingCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    padding: 16,
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  calendarIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: C.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    color: C.textMuted,
  },
  upcomingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: C.greenAccent,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  confirmedText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: 'transparent',
  },
  cancelBtnText: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '600',
  },
  // Created / Posted listings
  createdCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    padding: 20,
  },
  createdCardPast: {
    opacity: 0.7,
    borderColor: C.border,
  },
  createdHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  createdInfo: {
    flex: 1,
  },
  createdMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  organizerText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.greenAccent,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pastBadge: {
    backgroundColor: '#FEF3CD',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  pastBadgeText: {
    color: '#856404',
    fontSize: 10,
    fontWeight: '600',
  },
  createdTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: C.textPrimary,
    marginBottom: 7,
  },
  progressContainer: {
    marginTop: 10,
    maxWidth: 300,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressText: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '500',
  },
  progressCount: {
    fontWeight: '700',
    color: C.greenDark,
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
  },
  progressPctFull: {
    color: C.greenDark,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: 'transparent',
  },
  deleteBtnText: {
    fontSize: 13,
    color: C.textMuted,
    fontWeight: '600',
  },
})
