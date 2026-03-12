import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native'
import { C } from '../constants'
import { I } from './Icons'
import { ProgressBar, Avatar } from './Common'
import { formatDate, getTodayStr, useIsMobile } from '../utils'
import { fbGetUsersByIds } from '../firebase/api'

function VolunteerRoster({ volunteerIds, isOwner, isPast, listingId, confirmedVolunteers, onConfirmHours, onUnconfirmHours }) {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try { const users = await fbGetUsersByIds(volunteerIds); if (!cancelled) setVolunteers(users) }
      catch (e) { console.error(e) }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [volunteerIds.join(",")])

  return (
    <View style={styles.rosterCard}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <View style={styles.rosterIcon}><I.User size={18} color="#fff" /></View>
        <View>
          <Text style={{ fontWeight: "700", fontSize: 17, color: C.textPrimary }}>Signed-Up Volunteers</Text>
          <Text style={{ fontSize: 12, color: C.textMuted }}>{volunteerIds.length} volunteer{volunteerIds.length !== 1 ? "s" : ""}</Text>
        </View>
      </View>

      {loading ? (
        <Text style={{ padding: 20, textAlign: "center", color: C.textMuted, fontSize: 14 }}>Loading...</Text>
      ) : volunteerIds.length === 0 ? (
        <Text style={{ padding: 20, textAlign: "center", color: C.textMuted, fontSize: 14 }}>No sign-ups yet.</Text>
      ) : (
        volunteers.map((v, i) => {
          const confirmed = (confirmedVolunteers || []).includes(v.uid)
          return (
            <View key={v.uid} style={[styles.rosterRow, i > 0 && { borderTopWidth: 1, borderTopColor: C.borderLight }]}>
              <Avatar name={v.name} size={28} profilePic={v.profilePic} />
              <Text style={{ fontSize: 13, fontWeight: "500", color: C.textPrimary, flex: 1 }} numberOfLines={1}>{v.name || "Anonymous"}</Text>
              {isOwner && isPast ? (
                confirmed ? (
                  <TouchableOpacity onPress={() => onUnconfirmHours(listingId, v.uid)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 7, borderWidth: 1.5, borderColor: C.greenAccent, backgroundColor: C.greenLight }}>
                    <I.Check size={12} color={C.greenDark} /><Text style={{ color: C.greenDark, fontWeight: "600", fontSize: 11 }}>Confirmed</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => onConfirmHours(listingId, v.uid)}
                    style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 7, borderWidth: 1.5, borderColor: C.border }}>
                    <Text style={{ color: C.textMuted, fontWeight: "600", fontSize: 11 }}>Confirm</Text>
                  </TouchableOpacity>
                )
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.greenAccent }}>{v.hoursServed || 0}<Text style={{ fontSize: 10, color: C.textMuted, fontWeight: "400" }}> hrs</Text></Text>
              )}
            </View>
          )
        })
      )}
    </View>
  )
}

export default function EventDetail({ listing, signedUp, isOwner, onSignUp, onUnsign, onBack, onDelete, onConfirmHours, onUnconfirmHours }) {
  const spots = listing.volunteersNeeded - listing.currentVolunteers
  const full = spots <= 0

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 10 }}>
        <TouchableOpacity onPress={onBack} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <I.ArrowLeft size={18} color={C.textSecondary} />
          <Text style={{ color: C.textSecondary, fontSize: 14, fontWeight: "500" }}>Back</Text>
        </TouchableOpacity>
        {isOwner && (
          <TouchableOpacity onPress={() => onDelete(listing)} style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1.5, borderColor: C.border }}>
            <I.Trash size={14} color={C.textMuted} /><Text style={{ color: C.textMuted, fontWeight: "600", fontSize: 13 }}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.detailCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: C.greenAccent, letterSpacing: 0.7, textTransform: "uppercase" }}>{listing.organizer}</Text>
          {isOwner && <View style={{ backgroundColor: C.cream, borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 }}><Text style={{ fontSize: 10, fontWeight: "600", color: C.textSecondary }}>Your Listing</Text></View>}
        </View>

        <Text style={{ fontWeight: "800", fontSize: 26, color: C.textPrimary, marginTop: 6, marginBottom: 14, letterSpacing: -0.4, lineHeight: 32 }}>{listing.title}</Text>
        <Text style={{ fontSize: 15, color: C.textSecondary, lineHeight: 24, marginBottom: 22 }}>{listing.description}</Text>

        <View style={{ gap: 12, marginBottom: 22 }}>
          {[
            { icon: <I.Calendar size={16} color={C.greenAccent} />, label: "Date", value: formatDate(listing.date) },
            { icon: <I.Clock size={16} color={C.greenAccent} />, label: "Time", value: listing.time },
            { icon: <I.User size={16} color={C.greenAccent} />, label: "Organized by", value: listing.createdByName },
            { icon: <I.MapPin size={16} color={C.greenAccent} />, label: "Location", value: listing.location },
          ].map((x, i) => (
            <View key={i} style={styles.infoChip}>
              <View style={{ marginTop: 2 }}>{x.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: "600", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 2 }}>{x.label}</Text>
                <Text style={{ fontSize: 13, color: C.textPrimary, fontWeight: "500" }}>{x.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
          {listing.contactEmail ? (
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${listing.contactEmail}`)} style={styles.contactBtn}>
              <I.Mail size={14} color={C.greenDark} /><Text style={{ color: C.greenDark, fontSize: 13, fontWeight: "600" }}>{listing.contactEmail}</Text>
            </TouchableOpacity>
          ) : null}
          {listing.website ? (
            <TouchableOpacity onPress={() => Linking.openURL(listing.website)} style={styles.contactBtn}>
              <I.Link size={14} color={C.greenDark} /><Text style={{ color: C.greenDark, fontSize: 13, fontWeight: "600" }}>Website</Text>
            </TouchableOpacity>
          ) : null}
          {listing.location ? (
            <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}`)} style={styles.contactBtn}>
              <I.MapPin size={14} color={C.greenDark} /><Text style={{ color: C.greenDark, fontSize: 13, fontWeight: "600" }}>Open in Maps</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ marginBottom: 20, maxWidth: 400, alignSelf: "center", width: "100%" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 7 }}>
            <Text style={{ fontSize: 14, color: C.textSecondary }}>
              <Text style={{ fontWeight: "700", color: C.greenDark, fontSize: 17 }}>{listing.currentVolunteers}</Text> / {listing.volunteersNeeded} volunteers
            </Text>
            <Text style={{ fontSize: 13, color: full ? C.textMuted : C.greenAccent, fontWeight: "600" }}>{full ? "Full" : `${spots} spots left`}</Text>
          </View>
          <ProgressBar current={listing.currentVolunteers} total={listing.volunteersNeeded} />
        </View>

        {signedUp ? (
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <View style={{ paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, backgroundColor: C.greenLight, flexDirection: "row", alignItems: "center", gap: 7 }}>
              <I.Check size={16} color={C.greenDark} /><Text style={{ color: C.greenDark, fontWeight: "700", fontSize: 15 }}>You're Registered</Text>
            </View>
            <TouchableOpacity onPress={() => onUnsign(listing.id)} style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1.5, borderColor: C.border }}>
              <I.X size={14} color={C.textMuted} /><Text style={{ color: C.textMuted, fontWeight: "600", fontSize: 14 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => { if (!full) onSignUp(listing.id) }} disabled={full}
            style={{ paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12, backgroundColor: full ? C.cream : C.greenAccent, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, alignSelf: "center" }}>
            {full
              ? <Text style={{ color: C.textMuted, fontWeight: "700", fontSize: 15 }}>Event Full</Text>
              : <><Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Sign Up to Volunteer</Text><I.ArrowRight size={16} color="#fff" /></>
            }
          </TouchableOpacity>
        )}
      </View>

      {isOwner && <VolunteerRoster volunteerIds={listing.volunteers || []} isOwner={true} isPast={listing.date < getTodayStr()} listingId={listing.id} confirmedVolunteers={listing.confirmedVolunteers} onConfirmHours={onConfirmHours} onUnconfirmHours={onUnconfirmHours} />}
      {!isOwner && (listing.volunteers || []).length > 0 && <VolunteerRoster volunteerIds={listing.volunteers || []} isOwner={false} />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  detailCard: {
    backgroundColor: C.white, borderRadius: 20, borderWidth: 1, borderColor: C.borderLight,
    padding: 24, shadowColor: C.greenDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  infoChip: {
    backgroundColor: C.cream, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14,
    flexDirection: "row", alignItems: "flex-start", gap: 9,
  },
  contactBtn: {
    flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 7, paddingHorizontal: 14,
    borderRadius: 10, backgroundColor: C.greenLight,
  },
  rosterCard: {
    backgroundColor: C.white, borderRadius: 16, borderWidth: 1.5, borderColor: `${C.greenMid}40`,
    padding: 24, marginTop: 24,
    shadowColor: C.greenDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2,
  },
  rosterIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: C.greenAccent,
    alignItems: "center", justifyContent: "center",
  },
  rosterRow: {
    flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10,
  },
})
