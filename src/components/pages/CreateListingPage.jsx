import { useState } from 'react'
import { C } from '../../constants'
import { I } from '../Icons'
import { TimePicker } from '../Common'
import { getTodayStr, buildTimeStr, TIME_OPTIONS } from '../../utils'

// ── Auto-fill via Cloudflare Worker proxy ───────────────────────────────────
const WORKER_URL = "https://voluntir-ai.stanleyho862.workers.dev"

function snapToTimeOption(t) {
  if (!t) return ""
  // Normalize to HH:MM
  const m = t.match(/(\d{1,2}):(\d{2})/)
  if (!m) return ""
  const val = m[1].padStart(2, "0") + ":" + m[2]
  // Find exact match or nearest option
  const exact = TIME_OPTIONS.find(o => o.value === val)
  if (exact) return exact.value
  // Snap to nearest 15-min interval
  const mins = parseInt(m[1]) * 60 + parseInt(m[2])
  let best = TIME_OPTIONS[0].value
  let bestDiff = Infinity
  for (const o of TIME_OPTIONS) {
    const [oh, om] = o.value.split(":").map(Number)
    const diff = Math.abs(oh * 60 + om - mins)
    if (diff < bestDiff) { bestDiff = diff; best = o.value }
  }
  return best
}

function extractJSON(raw) {
  if (!raw) return null
  // 1. Direct parse
  try { return JSON.parse(raw) } catch {}
  // 2. Strip markdown fences
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()
  try { return JSON.parse(stripped) } catch {}
  // 3. Find the last {...} block (most likely the final answer)
  const matches = [...raw.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g)]
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      const obj = JSON.parse(matches[i][0])
      if ("title" in obj) return obj
    } catch {}
  }
  // 4. Greedy match from first { to last }
  const first = raw.indexOf("{")
  const last = raw.lastIndexOf("}")
  if (first !== -1 && last > first) {
    try { return JSON.parse(raw.slice(first, last + 1)) } catch {}
  }
  return null
}

async function autofillFromUrl(url) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  if (data.type === "error") throw new Error(data.error?.message || "API error")

  // Collect all text from the response
  const textBlocks = (data.content || []).filter(b => b.type === "text")
  if (!textBlocks.length) throw new Error("No text in AI response")

  // Try each text block (last first — that's usually the final answer)
  for (let i = textBlocks.length - 1; i >= 0; i--) {
    const parsed = extractJSON(textBlocks[i].text.trim())
    if (parsed && "title" in parsed) return parsed
  }

  // Fallback: join all text and try to extract
  const allText = textBlocks.map(b => b.text).join("\n")
  const parsed = extractJSON(allText)
  if (parsed && "title" in parsed) return parsed

  throw new Error("Could not parse AI response")
}

// ── Component ───────────────────────────────────────────────────────────────
export default function CreateListingPage({ user, onCreateListing, isMobile }) {
  const today = getTodayStr()

  const [form, setForm] = useState({
    title: "", description: "", volunteersNeeded: "", date: "",
    startTime: "", endTime: "", location: "", organizer: "", contactEmail: "", website: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [saving,    setSaving]    = useState(false)

  // Auto-fill state
  const [autofillUrl,     setAutofillUrl]     = useState("")
  const [autofillLoading, setAutofillLoading] = useState(false)
  const [autofillError,   setAutofillError]   = useState(null)
  const [autofillSuccess, setAutofillSuccess] = useState(false)

  const set = f => setForm(p => ({ ...p, ...f }))

  // ── Auto-fill handler ──────────────────────────────────────────────────────
  const handleAutofill = async () => {
    if (!autofillUrl.trim()) return
    setAutofillLoading(true)
    setAutofillError(null)
    setAutofillSuccess(false)

    try {
      const ex = await autofillFromUrl(autofillUrl.trim())

      // Build patch — only set fields that have real values (not null/undefined/"")
      const patch = {}
      const s = v => v != null && v !== "" && v !== "null"
      if (s(ex.title))            patch.title            = String(ex.title)
      if (s(ex.organizer))        patch.organizer        = String(ex.organizer)
      if (s(ex.description))      patch.description      = String(ex.description)
      if (s(ex.location))         patch.location         = String(ex.location)
      if (s(ex.contactEmail))     patch.contactEmail     = String(ex.contactEmail)
      if (s(ex.website))          patch.website          = String(ex.website)
      else                        patch.website          = autofillUrl.trim()
      if (s(ex.volunteersNeeded)) patch.volunteersNeeded = String(ex.volunteersNeeded)
      if (s(ex.startTime))        patch.startTime        = snapToTimeOption(String(ex.startTime))
      if (s(ex.endTime))          patch.endTime          = snapToTimeOption(String(ex.endTime))

      if (s(ex.date)) {
        const d = String(ex.date).slice(0, 10)
        if (d >= today) patch.date = d
      }

      set(patch)
      setAutofillSuccess(true)
      setTimeout(() => setAutofillSuccess(false), 4000)
    } catch (err) {
      console.error(err)
      setAutofillError("Couldn't extract info from that link. Please fill in the form manually.")
    } finally {
      setAutofillLoading(false)
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const go = async () => {
    if (!form.title || !form.date || !form.volunteersNeeded || !form.startTime || !form.endTime || !form.contactEmail) return
    setSaving(true)
    const data = {
      title: form.title, description: form.description,
      volunteersNeeded: parseInt(form.volunteersNeeded),
      date: form.date, time: buildTimeStr(form.startTime, form.endTime),
      location: form.location, organizer: form.organizer,
      contactEmail: form.contactEmail, website: form.website,
      currentVolunteers: 0, volunteers: [],
      createdBy: user.uid, createdByName: user.displayName || "Anonymous",
    }
    await onCreateListing(data)
    setSaving(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ title: "", description: "", volunteersNeeded: "", date: "", startTime: "", endTime: "", location: "", organizer: "", contactEmail: "", website: "" })
      setAutofillUrl("")
    }, 3000)
  }

  const inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, fontSize: 14, color: C.textPrimary, outline: "none", boxSizing: "border-box" }
  const lbl = { fontSize: 13, fontWeight: 600, color: C.textSecondary, marginBottom: 5, display: "block" }
  const ok  = form.title && form.date && form.volunteersNeeded && form.startTime && form.endTime && form.contactEmail

  if (submitted) return (
    <div style={{ animation: "fadeSlideIn 0.35s ease", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ background: C.white, borderRadius: 16, border: `2px solid ${C.greenAccent}`, padding: "50px 24px", textAlign: "center", boxShadow: `0 4px 20px ${C.shadowMd}` }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>🎉</div>
        <h2 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 22, color: C.greenDark, margin: "0 0 7px 0" }}>Listing Created!</h2>
        <p style={{ fontSize: 15, color: C.textSecondary }}>Your event is now live and open for volunteers.</p>
      </div>
    </div>
  )

  return (
    <div style={{ animation: "fadeSlideIn 0.35s ease", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: "clamp(22px,5vw,30px)", color: C.textPrimary, margin: "0 0 5px 0", letterSpacing: "-0.02em" }}>Create a Listing</h1>
        <p style={{ fontSize: 14, color: C.textSecondary }}>Post a new volunteer opportunity for the community.</p>
      </div>

      {/* ── Auto-fill Card ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.greenAccent}15, ${C.greenDark}08)`,
        borderRadius: 16,
        border: `1.5px solid ${C.greenAccent}40`,
        padding: isMobile ? 16 : 20,
        marginBottom: 18,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          
          <span style={{ fontWeight: 700, fontSize: 14, color: C.greenDark }}>Auto-fill from a link</span>
          <span style={{
            background: C.greenAccent, color: "#fff",
            fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, letterSpacing: "0.04em"
          }}>AI</span>
        </div>
        <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>
          Paste a link to a volunteering opportunity and we'll fill in the form for you.
        </p>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ ...inp, flex: 1, borderColor: autofillError ? C.red : C.border }}
            placeholder="https://volunteermatch.org/..."
            value={autofillUrl}
            onChange={e => { setAutofillUrl(e.target.value); setAutofillError(null) }}
            onKeyDown={e => e.key === "Enter" && handleAutofill()}
            onFocus={e => e.target.style.borderColor = C.greenAccent}
            onBlur={e => e.target.style.borderColor = autofillError ? C.red : C.border}
          />
          <button
            onClick={handleAutofill}
            disabled={!autofillUrl.trim() || autofillLoading}
            style={{
              padding: "11px 18px", borderRadius: 10, border: "none", whiteSpace: "nowrap",
              background: autofillUrl.trim() && !autofillLoading
                ? `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`
                : C.border,
              color: autofillUrl.trim() && !autofillLoading ? "#fff" : C.textMuted,
              fontWeight: 700, fontSize: 13,
              cursor: autofillUrl.trim() && !autofillLoading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.15s",
            }}
          >
            {autofillLoading ? (
              <>
                <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Filling…
              </>
            ) : "Auto-fill"}
          </button>
        </div>

        {/* Status messages */}
        {autofillError && (
          <p style={{ fontSize: 12, color: C.red, marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
            ⚠️ {autofillError}
          </p>
        )}
        {autofillSuccess && (
          <p style={{ fontSize: 12, color: C.greenDark, marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
            ✅ Form filled! Review the details below and make any edits.
          </p>
        )}
      </div>

      {/* ── Main Form ── */}
      <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`, padding: isMobile ? 20 : 28, boxShadow: `0 1px 3px ${C.shadow}` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div><label style={lbl}>Organization Name</label><input style={inp} placeholder="e.g., Portland Food Alliance" value={form.organizer} onChange={e => set({ organizer: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
          <div><label style={lbl}>Event Title *</label><input style={inp} placeholder="e.g., Weekend Food Drive" value={form.title} onChange={e => set({ title: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
          <div><label style={lbl}>Description</label><textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} placeholder="Describe the volunteer opportunity…" value={form.description} onChange={e => set({ description: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div><label style={lbl}># Volunteers Needed *</label><input style={inp} type="number" min="1" placeholder="e.g., 20" value={form.volunteersNeeded} onChange={e => set({ volunteersNeeded: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
            <div>
              <label style={lbl}>Date * <span style={{ color: C.textMuted, fontWeight: 400, fontSize: 11 }}>(today or later)</span></label>
              <input style={inp} type="date" min={today} value={form.date} onChange={e => set({ date: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          <div>
            <label style={lbl}>Event Time * <span style={{ color: C.textMuted, fontWeight: 400, fontSize: 11 }}>(auto-calculates volunteer hours)</span></label>
            <TimePicker startVal={form.startTime} endVal={form.endTime} onStartChange={v => set({ startTime: v })} onEndChange={v => set({ endTime: v })} />
          </div>

          <div><label style={lbl}>Location</label><input style={inp} placeholder="e.g., 123 Main St, Portland, OR" value={form.location} onChange={e => set({ location: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div><label style={lbl}>Contact Email *</label><input style={inp} type="email" placeholder="contact@org.com" value={form.contactEmail} onChange={e => set({ contactEmail: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
            <div><label style={lbl}>Website</label><input style={inp} type="url" placeholder="https://yourorg.com" value={form.website} onChange={e => set({ website: e.target.value })} onFocus={e => e.target.style.borderColor = C.greenAccent} onBlur={e => e.target.style.borderColor = C.border} /></div>
          </div>

          <button onClick={go} disabled={!ok || saving}
            style={{ padding: "13px 24px", borderRadius: 12, border: "none", background: ok ? `linear-gradient(135deg,${C.greenAccent},${C.greenDark})` : C.border, color: ok ? "#fff" : C.textMuted, fontWeight: 700, fontSize: 15, cursor: ok ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <I.Plus />{saving ? "Publishing…" : "Publish Listing"}
          </button>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}