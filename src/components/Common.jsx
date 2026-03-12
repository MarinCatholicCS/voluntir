import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Modal, Image, ScrollView, StyleSheet } from 'react-native'
import { C } from '../constants'
import { I } from './Icons'
import { getInitials, TIME_OPTIONS, toMins, toLabel, calcHours } from '../utils'

export function ProgressBar({ current, total }) {
  const pct = Math.min((current / total) * 100, 100)
  return (
    <View style={{ width: "100%", height: 6, borderRadius: 3, backgroundColor: C.borderLight, overflow: "hidden" }}>
      <View style={{ width: `${pct}%`, height: "100%", borderRadius: 3, backgroundColor: C.greenAccent }} />
    </View>
  )
}

export function Avatar({ name, size = 40, rank, photoURL, profilePic }) {
  const ini = getInitials(name)
  const cols = [
    { bg: C.greenLight, text: C.greenDark },
    { bg: "#FFF3E0",    text: "#E65100"   },
    { bg: "#E3F2FD",    text: "#1565C0"   },
    { bg: "#FCE4EC",    text: "#AD1457"   },
    { bg: "#F3E5F5",    text: "#6A1B9A"   },
  ]
  const c    = cols[(ini.charCodeAt(0) + (ini.length > 1 ? ini.charCodeAt(1) : 0)) % cols.length]
  const top3 = rank !== undefined && rank < 3
  const imgSrc = profilePic || photoURL

  return (
    <View style={{ width: size, height: size, flexShrink: 0 }}>
      {imgSrc ? (
        <Image
          source={{ uri: imgSrc }}
          style={{
            width: size, height: size, borderRadius: size / 2,
            borderWidth: top3 ? 2 : 0, borderColor: C.greenAccent,
          }}
        />
      ) : (
        <View style={{
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: c.bg, alignItems: "center", justifyContent: "center",
          borderWidth: top3 ? 2 : 0, borderColor: C.greenAccent,
        }}>
          <Text style={{ color: c.text, fontWeight: "700", fontSize: size * 0.36 }}>{ini}</Text>
        </View>
      )}
    </View>
  )
}

export function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🗑️</Text>
          <Text style={[styles.modalTitle, { fontWeight: "800" }]}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={onCancel} style={[styles.modalBtn, { borderWidth: 1.5, borderColor: C.border }]}>
              <Text style={{ fontWeight: "600", fontSize: 14, color: C.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.modalBtn, { backgroundColor: C.red }]}>
              <Text style={{ fontWeight: "700", fontSize: 14, color: "#fff" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export function TimePicker({ startVal, endVal, onStartChange, onEndChange }) {
  const [showStart, setShowStart] = useState(false)
  const [showEnd, setShowEnd] = useState(false)
  const hours = calcHours(startVal, endVal)
  const endOptions = TIME_OPTIONS.filter(o => !startVal || toMins(o.value) > toMins(startVal))

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallLabel}>START TIME</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setShowStart(true)}>
            <Text style={{ fontSize: 14, color: startVal ? C.textPrimary : C.textMuted }}>
              {startVal ? toLabel(startVal) : "Select start…"}
            </Text>
            <I.ChevronDown size={14} color={C.textMuted} />
          </TouchableOpacity>
          <TimePickerModal
            visible={showStart}
            options={TIME_OPTIONS}
            selected={startVal}
            onSelect={v => { onStartChange(v); setShowStart(false) }}
            onClose={() => setShowStart(false)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallLabel}>END TIME</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setShowEnd(true)}>
            <Text style={{ fontSize: 14, color: endVal ? C.textPrimary : C.textMuted }}>
              {endVal ? toLabel(endVal) : "Select end…"}
            </Text>
            <I.ChevronDown size={14} color={C.textMuted} />
          </TouchableOpacity>
          <TimePickerModal
            visible={showEnd}
            options={endOptions}
            selected={endVal}
            onSelect={v => { onEndChange(v); setShowEnd(false) }}
            onClose={() => setShowEnd(false)}
          />
        </View>
      </View>
      {startVal && endVal ? (
        <View style={{ marginTop: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: C.greenLight, flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" }}>
          <I.Clock size={14} color={C.greenDark} />
          <Text style={{ fontSize: 13, fontWeight: "600", color: C.greenDark }}>
            {hours} hour{hours !== 1 ? "s" : ""} · {toLabel(startVal)} – {toLabel(endVal)}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

function TimePickerModal({ visible, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={{ backgroundColor: C.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "50%", paddingTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: C.textPrimary, textAlign: "center", marginBottom: 12 }}>Select Time</Text>
          <ScrollView>
            {options.map(o => (
              <TouchableOpacity
                key={o.value}
                onPress={() => onSelect(o.value)}
                style={{ paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: C.borderLight, backgroundColor: o.value === selected ? C.greenLight : "transparent" }}
              >
                <Text style={{ fontSize: 16, color: o.value === selected ? C.greenDark : C.textPrimary, fontWeight: o.value === selected ? "700" : "400" }}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export function SkillsInput({ skills, onChange }) {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim()
    if (t && !skills.includes(t)) onChange([...skills, t])
    setInput('')
  }
  return (
    <View>
      {skills.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {skills.map(s => (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20, backgroundColor: C.greenLight }}>
              <Text style={{ color: C.greenDark, fontSize: 12, fontWeight: '600' }}>{s}</Text>
              <TouchableOpacity onPress={() => onChange(skills.filter(x => x !== s))}>
                <Text style={{ color: C.greenDark, fontSize: 15, lineHeight: 17 }}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <TextInput
        value={input}
        onChangeText={setInput}
        onSubmitEditing={add}
        onBlur={add}
        placeholder="Type a skill, press Enter to add"
        placeholderTextColor={C.textMuted}
        style={styles.textInput}
      />
    </View>
  )
}

export function LoginModal({ visible, onClose, onLogin, loginLoading, loginError }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.loginCard} onStartShouldSetResponder={() => true}>
          <TouchableOpacity onPress={onClose} style={{ position: "absolute", top: 14, right: 14, padding: 4 }}>
            <I.X size={18} color={C.textMuted} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 7 }}>
            <Image source={require('../../assets/voluntir.png')} style={{ width: 36, height: 36, borderRadius: 10 }} />
            <Text style={{ fontWeight: "800", fontSize: 22, color: C.textPrimary, letterSpacing: -0.4 }}>Voluntir</Text>
          </View>
          <Text style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24, lineHeight: 22, textAlign: "center" }}>
            Sign in to sign up for events, create listings, and track your volunteer hours.
          </Text>
          {loginError ? (
            <View style={{ backgroundColor: C.redLight, borderRadius: 10, padding: 12, marginBottom: 14 }}>
              <Text style={{ fontSize: 13, color: C.red }}>{loginError}</Text>
            </View>
          ) : null}
          <TouchableOpacity onPress={onLogin} disabled={loginLoading} style={styles.googleBtn}>
            <I.Google size={18} />
            <Text style={{ fontWeight: "600", fontSize: 15, color: C.textPrimary }}>
              {loginLoading ? "Signing in..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export function Toast({ message }) {
  if (!message) return null
  return (
    <View style={styles.toast}>
      <I.Check size={14} color={C.greenMid} />
      <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24,
  },
  modalCard: {
    backgroundColor: C.white, borderRadius: 20, padding: 28, maxWidth: 400, width: "100%",
  },
  modalTitle: {
    fontSize: 22, color: C.textPrimary, marginBottom: 10, textAlign: "center",
  },
  modalMessage: {
    fontSize: 14, color: C.textSecondary, lineHeight: 22, marginBottom: 24, textAlign: "center",
  },
  modalBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: "center",
  },
  smallLabel: {
    fontSize: 12, fontWeight: "600", color: C.textMuted, marginBottom: 5, letterSpacing: 0.4, textTransform: "uppercase",
  },
  selectBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white,
  },
  textInput: {
    width: "100%", padding: 10, borderRadius: 8, borderWidth: 1.5, borderColor: C.border,
    fontSize: 14, color: C.textPrimary,
  },
  loginCard: {
    backgroundColor: C.white, borderRadius: 22, padding: 28, maxWidth: 400, width: "100%",
  },
  googleBtn: {
    width: "100%", paddingVertical: 13, paddingHorizontal: 20, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
  },
  toast: {
    position: "absolute", bottom: 80, alignSelf: "center",
    backgroundColor: C.greenDark, paddingVertical: 11, paddingHorizontal: 20,
    borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 7,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 12,
    elevation: 8, zIndex: 200,
  },
})
