import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { C } from '../constants'
import { I } from './Icons'
import { ProgressBar } from './Common'
import { formatDate } from '../utils'

export default function EventCard({ listing, signedUp, isOwner, onSignUp, onUnsign, onView, onDelete }) {
  const spots = listing.volunteersNeeded - listing.currentVolunteers
  const full  = spots <= 0
  const [skillsExpanded, setSkillsExpanded] = useState(false)
  const skills    = listing.skills || []
  const shown     = skillsExpanded ? skills : skills.slice(0, 2)
  const overflow  = skills.length - 2

  return (
    <TouchableOpacity onPress={onView} activeOpacity={0.7} style={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: "600", color: C.greenAccent, letterSpacing: 0.7, textTransform: "uppercase", flex: 1, paddingRight: 8 }}>{listing.organizer}</Text>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          {isOwner && <View style={styles.badge}><Text style={{ color: C.textSecondary, fontSize: 10, fontWeight: "600" }}>Your Listing</Text></View>}
          {signedUp && <View style={[styles.badge, { backgroundColor: C.greenAccent }]}><I.Check size={10} color="#fff" /><Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>Signed Up</Text></View>}
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{listing.description}</Text>

      <View style={{ gap: 5, marginBottom: 12 }}>
        <View style={styles.infoRow}><I.Calendar size={14} color={C.textMuted} /><Text style={styles.infoText}>{formatDate(listing.date)}</Text></View>
        <View style={styles.infoRow}><I.MapPin size={14} color={C.textMuted} /><Text style={styles.infoText} numberOfLines={1}>{listing.location}</Text></View>
      </View>

      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
          <Text style={{ fontSize: 12, color: C.textSecondary }}>
            <Text style={{ fontWeight: "700", color: C.greenDark }}>{listing.currentVolunteers}</Text> / {listing.volunteersNeeded} volunteers
          </Text>
          <Text style={{ fontSize: 11, color: full ? C.textMuted : C.greenAccent, fontWeight: "600" }}>{full ? "Full" : `${spots} left`}</Text>
        </View>
        <ProgressBar current={listing.currentVolunteers} total={listing.volunteersNeeded} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 5, marginBottom: 12 }}>
        {skills.length === 0
          ? <Text style={{ fontSize: 11, color: C.textMuted, fontStyle: "italic" }}>No skills needed</Text>
          : <>
              {shown.map(s => (
                <View key={s} style={styles.skillBadge}><Text style={{ color: C.greenDark, fontSize: 11, fontWeight: "600" }}>{s}</Text></View>
              ))}
              {!skillsExpanded && overflow > 0 && (
                <TouchableOpacity onPress={e => setSkillsExpanded(true)} style={[styles.skillBadge, { backgroundColor: C.cream }]}>
                  <Text style={{ color: C.textSecondary, fontSize: 11, fontWeight: "600" }}>+{overflow}</Text>
                </TouchableOpacity>
              )}
            </>
        }
      </View>

      <View style={{ flexDirection: "row", gap: 7 }}>
        {signedUp ? (
          <>
            <View style={[styles.actionBtn, { flex: 1, backgroundColor: C.greenLight }]}>
              <I.Check size={14} color={C.greenDark} /><Text style={{ color: C.greenDark, fontWeight: "600", fontSize: 13 }}>Registered</Text>
            </View>
            <TouchableOpacity onPress={() => onUnsign(listing.id)} style={[styles.actionBtn, { borderWidth: 1.5, borderColor: C.border }]}>
              <I.X size={14} color={C.textMuted} /><Text style={{ color: C.textMuted, fontWeight: "600", fontSize: 13 }}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => { if (!full) onSignUp(listing.id) }} disabled={full}
            style={[styles.actionBtn, { flex: 1, backgroundColor: full ? C.cream : C.greenAccent }]}>
            {full
              ? <Text style={{ color: C.textMuted, fontWeight: "600", fontSize: 13 }}>Event Full</Text>
              : <><Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Sign Up</Text><I.ArrowRight size={14} color="#fff" /></>
            }
          </TouchableOpacity>
        )}
        {isOwner && (
          <TouchableOpacity onPress={() => onDelete(listing)} style={[styles.actionBtn, { borderWidth: 1.5, borderColor: C.border }]}>
            <I.Trash size={14} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.borderLight,
    padding: 20, shadowColor: C.greenDark, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  badge: {
    backgroundColor: C.cream, borderRadius: 6, paddingVertical: 2, paddingHorizontal: 6,
    flexDirection: "row", alignItems: "center", gap: 2,
  },
  title: {
    fontWeight: "700", fontSize: 18, color: C.textPrimary, marginBottom: 6, lineHeight: 23,
  },
  description: {
    fontSize: 13, color: C.textSecondary, lineHeight: 20, marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row", alignItems: "center", gap: 7,
  },
  infoText: {
    fontSize: 12, color: C.textMuted, flex: 1,
  },
  skillBadge: {
    paddingVertical: 2, paddingHorizontal: 8, borderRadius: 20, backgroundColor: C.greenLight,
  },
  actionBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
    paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10,
  },
})
