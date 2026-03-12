import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { C } from '../../constants';
import { I } from '../Icons';
import { Avatar, SkillsInput } from '../Common';
import { getTodayStr, formatDate, useIsMobile } from '../../utils';
import { useApp } from '../../context/AppContext';
import { fbGetProfile, fbSetProfile } from '../../firebase/api';

/* ─── ViewProfileModal ─── */
export function ViewProfileModal({ visible, onClose, uid }) {
  const { leaderboard } = useApp();
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !uid) return;
    setLoading(true);
    fbGetProfile(uid)
      .then((p) => setProf(p || {}))
      .catch(() => setProf({}))
      .finally(() => setLoading(false));
  }, [visible, uid]);

  const rank = leaderboard
    ? leaderboard.findIndex((e) => e.uid === uid) + 1
    : 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <TouchableOpacity style={s.modalClose} onPress={onClose}>
            <I.Close size={22} color={C.textSecondary} />
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color={C.greenAccent} style={{ marginVertical: 40 }} />
          ) : prof ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.modalHeader}>
                <Avatar uri={prof.photoURL} size={80} />
                <Text style={s.modalName}>{prof.name || 'Volunteer'}</Text>
                {prof.school ? (
                  <Text style={s.modalSub}>{prof.school}</Text>
                ) : null}
                {prof.location ? (
                  <View style={s.row}>
                    <I.Location size={14} color={C.textMuted} />
                    <Text style={[s.modalSub, { marginLeft: 4 }]}>{prof.location}</Text>
                  </View>
                ) : null}
              </View>

              {prof.age ? (
                <Text style={s.modalDetail}>Age: {prof.age}</Text>
              ) : null}

              <View style={s.statsRow}>
                <StatCard label="Hours" value={prof.hoursServed ?? 0} />
                <StatCard label="Events" value={0} />
                <StatCard label="Rank" value={rank || '—'} />
              </View>

              {prof.skills?.length > 0 && (
                <View style={s.skillsWrap}>
                  {prof.skills.map((sk, i) => (
                    <View key={i} style={s.pill}>
                      <Text style={s.pillText}>{sk}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          ) : (
            <Text style={s.emptyText}>Profile not found.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

/* ─── StatCard ─── */
function StatCard({ label, value }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

/* ─── EventRow ─── */
function EventRow({ ev, isPast }) {
  return (
    <View style={s.eventRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.eventTitle}>{ev.title}</Text>
        <Text style={s.eventDate}>{formatDate(ev.date)}</Text>
      </View>
      {isPast && (
        <View style={[s.badge, ev.confirmed ? s.badgeConfirmed : s.badgePending]}>
          <Text style={[s.badgeText, ev.confirmed ? s.badgeConfirmedText : s.badgePendingText]}>
            {ev.confirmed ? 'Confirmed' : 'Completed'}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ─── ProfilePage ─── */
export default function ProfilePage() {
  const { user, profile, setProfile, listings, leaderboard } = useApp();
  const isMobile = useIsMobile();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    location: '',
    school: '',
    skills: [],
    photoURL: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        age: profile.age || '',
        location: profile.location || '',
        school: profile.school || '',
        skills: profile.skills || [],
        photoURL: profile.photoURL || '',
      });
    }
  }, [profile]);

  const todayStr = getTodayStr();

  const myRegistered = (listings || []).filter(
    (l) => (l.volunteers || []).includes(user?.uid) && l.date >= todayStr
  );
  const myPast = (listings || []).filter(
    (l) => (l.volunteers || []).includes(user?.uid) && l.date < todayStr
  );

  const rank = leaderboard
    ? leaderboard.findIndex((e) => e.uid === user?.uid) + 1
    : 0;

  const updateField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]) {
      updateField('photoURL', result.assets[0].uri);
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fbSetProfile(user.uid, {
        name: form.name,
        age: form.age,
        location: form.location,
        school: form.school,
        skills: form.skills,
        photoURL: form.photoURL,
      });
      setProfile((prev) => ({ ...prev, ...form }));
      setEditing(false);
    } catch (e) {
      console.error('Save profile error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setForm({
        name: profile.name || '',
        age: profile.age || '',
        location: profile.location || '',
        school: profile.school || '',
        skills: profile.skills || [],
        photoURL: profile.photoURL || '',
      });
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* ── Profile Header ── */}
      <View style={s.card}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={editing ? pickImage : undefined} activeOpacity={editing ? 0.7 : 1}>
            {form.photoURL ? (
              <Image source={{ uri: form.photoURL }} style={s.avatar} />
            ) : (
              <Avatar uri={null} size={88} />
            )}
            {editing && (
              <View style={s.cameraBadge}>
                <I.Camera size={16} color={C.white} />
              </View>
            )}
          </TouchableOpacity>

          {!editing && (
            <TouchableOpacity style={s.editBtn} onPress={() => setEditing(true)}>
              <I.Edit size={16} color={C.greenAccent} />
              <Text style={s.editBtnText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <View style={s.formSection}>
            <Text style={s.label}>Name</Text>
            <TextInput
              style={s.input}
              value={form.name}
              onChangeText={(v) => updateField('name', v)}
              placeholder="Your name"
              placeholderTextColor={C.textMuted}
            />

            <Text style={s.label}>Age</Text>
            <TextInput
              style={s.input}
              value={form.age}
              onChangeText={(v) => updateField('age', v)}
              placeholder="Your age"
              placeholderTextColor={C.textMuted}
              keyboardType="number-pad"
            />

            <Text style={s.label}>Location</Text>
            <TextInput
              style={s.input}
              value={form.location}
              onChangeText={(v) => updateField('location', v)}
              placeholder="City, State"
              placeholderTextColor={C.textMuted}
            />

            <Text style={s.label}>School</Text>
            <TextInput
              style={s.input}
              value={form.school}
              onChangeText={(v) => updateField('school', v)}
              placeholder="Your school"
              placeholderTextColor={C.textMuted}
            />

            <Text style={s.label}>Skills</Text>
            <SkillsInput
              skills={form.skills}
              onChange={(sk) => updateField('skills', sk)}
            />

            <View style={s.formBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={handleCancel}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color={C.white} />
                ) : (
                  <Text style={s.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={s.infoSection}>
            <Text style={s.name}>{profile?.name || user?.displayName || 'Volunteer'}</Text>
            {profile?.school ? <Text style={s.sub}>{profile.school}</Text> : null}
            <View style={s.detailRow}>
              {profile?.age ? (
                <View style={s.row}>
                  <I.User size={14} color={C.textMuted} />
                  <Text style={s.detailText}>{profile.age} years old</Text>
                </View>
              ) : null}
              {profile?.location ? (
                <View style={s.row}>
                  <I.Location size={14} color={C.textMuted} />
                  <Text style={s.detailText}>{profile.location}</Text>
                </View>
              ) : null}
            </View>
            {user?.email ? (
              <View style={s.row}>
                <I.Email size={14} color={C.textMuted} />
                <Text style={s.detailText}>{user.email}</Text>
              </View>
            ) : null}

            {profile?.skills?.length > 0 && (
              <View style={s.skillsWrap}>
                {profile.skills.map((sk, i) => (
                  <View key={i} style={s.pill}>
                    <Text style={s.pillText}>{sk}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* ── Stats ── */}
      <View style={s.statsRow}>
        <StatCard label="Hours Served" value={profile?.hoursServed ?? 0} />
        <StatCard label="Events Joined" value={myRegistered.length + myPast.length} />
        <StatCard label="Board Rank" value={rank || '—'} />
      </View>

      {/* ── Registered Events ── */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>Registered Events</Text>
        {myRegistered.length === 0 ? (
          <Text style={s.emptyText}>No upcoming events registered.</Text>
        ) : (
          myRegistered.map((ev) => <EventRow key={ev.id} ev={ev} isPast={false} />)
        )}
      </View>

      {/* ── Past Events ── */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>Past Events</Text>
        {myPast.length === 0 ? (
          <Text style={s.emptyText}>No past events yet.</Text>
        ) : (
          myPast.map((ev) => <EventRow key={ev.id} ev={ev} isPast />)
        )}
      </View>
    </ScrollView>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.offWhite,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Card */
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.greenLight,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: C.greenAccent,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.white,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.greenAccent,
  },
  editBtnText: {
    color: C.greenAccent,
    fontFamily: 'Asap',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },

  /* Info */
  infoSection: {
    marginTop: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: C.textPrimary,
    fontFamily: 'Asap',
  },
  sub: {
    fontSize: 15,
    color: C.textSecondary,
    fontFamily: 'Asap',
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: C.textSecondary,
    fontFamily: 'Asap',
    marginLeft: 6,
  },

  /* Skills */
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  pill: {
    backgroundColor: C.greenLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    color: C.greenDark,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Asap',
  },

  /* Form */
  formSection: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textPrimary,
    fontFamily: 'Asap',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: C.cream,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: C.textPrimary,
    fontFamily: 'Asap',
    borderWidth: 1,
    borderColor: C.border,
  },
  formBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: C.textSecondary,
    fontWeight: '600',
    fontFamily: 'Asap',
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: C.greenAccent,
    alignItems: 'center',
  },
  saveBtnText: {
    color: C.white,
    fontWeight: '700',
    fontFamily: 'Asap',
    fontSize: 15,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: C.greenDark,
    fontFamily: 'Asap',
  },
  statLabel: {
    fontSize: 12,
    color: C.textMuted,
    fontFamily: 'Asap',
    marginTop: 4,
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.textPrimary,
    fontFamily: 'Asap',
    marginBottom: 12,
  },

  /* Event Row */
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.textPrimary,
    fontFamily: 'Asap',
  },
  eventDate: {
    fontSize: 13,
    color: C.textMuted,
    fontFamily: 'Asap',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeConfirmed: {
    backgroundColor: C.greenLight,
  },
  badgePending: {
    backgroundColor: C.cream,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Asap',
  },
  badgeConfirmedText: {
    color: C.greenDark,
  },
  badgePendingText: {
    color: C.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: C.textMuted,
    fontFamily: 'Asap',
    textAlign: 'center',
    paddingVertical: 20,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalClose: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalName: {
    fontSize: 20,
    fontWeight: '700',
    color: C.textPrimary,
    fontFamily: 'Asap',
    marginTop: 12,
  },
  modalSub: {
    fontSize: 14,
    color: C.textSecondary,
    fontFamily: 'Asap',
    marginTop: 2,
  },
  modalDetail: {
    fontSize: 14,
    color: C.textSecondary,
    fontFamily: 'Asap',
    textAlign: 'center',
    marginBottom: 12,
  },
});
