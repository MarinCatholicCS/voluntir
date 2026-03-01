// js/utils.js
// Utility helpers: dates, time, formatting

function getTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function genTimeOptions() {
  const opts = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      const ap  = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      opts.push({
        label: `${h12}:${String(m).padStart(2, "0")} ${ap}`,
        value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      });
    }
  }
  return opts;
}

const TIME_OPTIONS = genTimeOptions();

function toMins(v)          { const [h, m] = v.split(":").map(Number); return h * 60 + m; }
function toLabel(v)         { if (!v) return ""; const o = TIME_OPTIONS.find(x => x.value === v); return o ? o.label : v; }
function calcHours(s, e)    { if (!s || !e) return 0; return Math.max(0, Math.round((toMins(e) - toMins(s)) / 60 * 10) / 10); }
function buildTimeStr(s, e) { if (!s || !e) return ""; return `${toLabel(s)} – ${toLabel(e)}`; }

function parseHours(t) {
  if (!t) return 2;
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 2;
  let sh = +m[1], sm = +m[2], sp = m[3].toUpperCase(), eh = +m[4], em = +m[5], ep = m[6].toUpperCase();
  if (sp === "PM" && sh !== 12) sh += 12; if (sp === "AM" && sh === 12) sh = 0;
  if (ep === "PM" && eh !== 12) eh += 12; if (ep === "AM" && eh === 12) eh = 0;
  return Math.max(1, Math.round((eh * 60 + em - (sh * 60 + sm)) / 60));
}

function formatDate(s) {
  if (!s) return "";
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function getInitials(n) {
  if (!n) return "??";
  return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

function btnStyle(variant = "primary", extra = {}) {
  const base = {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 6, padding: "10px 16px", borderRadius: 10,
    fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
    ...extra,
  };
  if (variant === "primary") return { ...base, border: "none", background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: "#fff" };
  if (variant === "ghost")   return { ...base, border: `1.5px solid ${C.border}`, background: "transparent", color: C.textMuted };
  if (variant === "danger")  return { ...base, border: `1.5px solid ${C.border}`, background: "transparent", color: C.textMuted };
  return base;
}

// Expose globals
window.getTodayStr   = getTodayStr;
window.TIME_OPTIONS  = TIME_OPTIONS;
window.toMins        = toMins;
window.toLabel       = toLabel;
window.calcHours     = calcHours;
window.buildTimeStr  = buildTimeStr;
window.parseHours    = parseHours;
window.formatDate    = formatDate;
window.getInitials   = getInitials;
window.useIsMobile   = useIsMobile;
window.btnStyle      = btnStyle;
