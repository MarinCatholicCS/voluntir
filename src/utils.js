import { useState, useEffect } from 'react'
import { Dimensions, Platform } from 'react-native'
import { C } from './constants'

export function getTodayStr() {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function genTimeOptions() {
  const opts = []
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      const ap  = h < 12 ? "AM" : "PM"
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      opts.push({
        label: `${h12}:${String(m).padStart(2, "0")} ${ap}`,
        value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      })
    }
  }
  return opts
}

export const TIME_OPTIONS = genTimeOptions()

export function toMins(v)          { const [h, m] = v.split(":").map(Number); return h * 60 + m }
export function toLabel(v)         { if (!v) return ""; const o = TIME_OPTIONS.find(x => x.value === v); return o ? o.label : v }
export function calcHours(s, e)    { if (!s || !e) return 0; return Math.max(0, Math.round((toMins(e) - toMins(s)) / 60 * 10) / 10) }
export function buildTimeStr(s, e) { if (!s || !e) return ""; return `${toLabel(s)} – ${toLabel(e)}` }

export function parseHours(t) {
  if (!t) return 2
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 2
  let sh = +m[1], sm = +m[2], sp = m[3].toUpperCase(), eh = +m[4], em = +m[5], ep = m[6].toUpperCase()
  if (sp === "PM" && sh !== 12) sh += 12; if (sp === "AM" && sh === 12) sh = 0
  if (ep === "PM" && eh !== 12) eh += 12; if (ep === "AM" && eh === 12) eh = 0
  return Math.max(1, Math.round((eh * 60 + em - (sh * 60 + sm)) / 60))
}

export function formatDate(s) {
  if (!s) return ""
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

export function getInitials(n) {
  if (!n) return "??"
  return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (Platform.OS !== 'web') return true
    return Dimensions.get('window').width <= 768
  })
  useEffect(() => {
    if (Platform.OS !== 'web') return
    const handler = ({ window }) => setIsMobile(window.width <= 768)
    const sub = Dimensions.addEventListener('change', handler)
    return () => sub?.remove()
  }, [])
  return isMobile
}

export async function rankListingsBySkills(listings, _userSkills) {
  return listings
}

export function btnStyle(variant = "primary", extra = {}) {
  const base = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    ...extra,
  }
  if (variant === "primary") return { ...base, backgroundColor: C.greenAccent }
  if (variant === "ghost")   return { ...base, borderWidth: 1.5, borderColor: C.border, backgroundColor: "transparent" }
  if (variant === "danger")  return { ...base, borderWidth: 1.5, borderColor: C.border, backgroundColor: "transparent" }
  return base
}
