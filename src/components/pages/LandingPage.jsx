import { useState, useEffect, useRef } from 'react'
import { C } from '../../constants'

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

const reveal = (visible, delay = 0, dir = 'up') => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none'
    : dir === 'up'    ? 'translateY(36px)'
    : dir === 'left'  ? 'translateX(-36px)'
    :                   'translateX(36px)',
  transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.25,1,0.5,1) ${delay}s`,
})

export default function LandingPage({ onLogin, onBrowse }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  const [refCards, vCards] = useReveal()
  const [refQuote, vQuote] = useReveal()
  const [refHow,   vHow]   = useReveal()
  const [refCta,   vCta]   = useReveal()

  const heroFade = (delay) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? 'none' : 'translateY(22px)',
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.25,1,0.5,1) ${delay}s`,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.borderLight}`,
        padding: '0 24px',
        animation: 'landingFadeDown 0.55s cubic-bezier(0.25,1,0.5,1) both',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <img src={`${import.meta.env.BASE_URL}voluntir.png`} alt="" style={{ width: 34, height: 34, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            </div>
            <span style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: 22, color: C.textPrimary, letterSpacing: '-0.02em' }}>Voluntir</span>
          </div>
          <button
            onClick={onLogin}
            style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: C.greenAccent, color: '#fff', fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: '-0.01em' }}
            onMouseEnter={e => e.currentTarget.style.background = C.greenDark}
            onMouseLeave={e => e.currentTarget.style.background = C.greenAccent}
          >Log in</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px 100px', textAlign: 'center', position: 'relative',
      }}>
        {/* pill badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: C.greenLight, borderRadius: 100, padding: '5px 14px', marginBottom: 30,
          ...heroFade(0.1),
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.greenAccent }} />
          <span style={{ fontFamily: "'Asap', sans-serif", fontSize: 13, fontWeight: 600, color: C.greenDark }}>Free for students &amp; organizations</span>
        </div>

        {/* headline */}
        <h1 style={{
          fontFamily: "'Asap', sans-serif", fontWeight: 800,
          fontSize: 'clamp(44px, 9vw, 86px)',
          color: C.textPrimary, letterSpacing: '-0.035em',
          lineHeight: 1.04, maxWidth: 820, marginBottom: 24,
          ...heroFade(0.22),
        }}>
          Volunteer Smarter.<br />
          <span style={{ color: C.greenAccent }}>Connect Deeper.</span>
        </h1>

        {/* subtext */}
        <p style={{
          fontFamily: "'Asap', sans-serif", fontWeight: 500,
          fontSize: 18, color: C.textSecondary, maxWidth: 500,
          lineHeight: 1.65, marginBottom: 44,
          ...heroFade(0.38),
        }}>
          Discover local volunteer events, sign up in seconds, and watch your community impact grow.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', ...heroFade(0.52) }}>
          <button
            onClick={onLogin}
            style={{ padding: '14px 34px', borderRadius: 13, border: 'none', background: C.greenAccent, color: '#fff', fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 16, cursor: 'pointer', letterSpacing: '-0.01em' }}
            onMouseEnter={e => e.currentTarget.style.background = C.greenDark}
            onMouseLeave={e => e.currentTarget.style.background = C.greenAccent}
          >Get started</button>
          <button
            onClick={onBrowse}
            style={{ padding: '14px 34px', borderRadius: 13, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.textSecondary, fontFamily: "'Asap', sans-serif", fontWeight: 600, fontSize: 16, cursor: 'pointer', letterSpacing: '-0.01em' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.textMuted; e.currentTarget.style.color = C.textPrimary }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary }}
          >Browse as a Guest</button>
        </div>

        {/* scroll hint */}
        <div style={{
          position: 'absolute', bottom: 36,
          opacity: ready ? 0.4 : 0,
          transition: 'opacity 1s ease 1.2s',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section style={{ padding: '50px 24px 100px' }}>
        <div ref={refCards} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20, maxWidth: 1060, margin: '0 auto',
        }}>
          {[
            { accent: C.greenAccent, tag: 'Discover', title: 'Find opportunities near you', body: 'Browse upcoming volunteer events filtered by date, location, and preferred skills. Something for everyone.' },
            { accent: C.greenDark,   tag: 'Track',    title: 'Log every hour you give',     body: 'Organizers confirm your attendance. Hours land on your profile and leaderboard ranking automatically.' },
            { accent: C.greenDeep,   tag: 'Connect',  title: 'See who\'s giving back',      body: 'Climb the volunteer leaderboard. Inspire others in your school or community to show up and do the same.' },
          ].map(({ accent, tag, title, body }, i) => (
            <div key={i} style={{
              background: C.offWhite, borderRadius: 20,
              border: `1px solid ${C.borderLight}`,
              padding: '28px 24px', overflow: 'hidden', position: 'relative',
              ...reveal(vCards, i * 0.14),
            }}>
              <div style={{ width: 36, height: 4, borderRadius: 4, background: accent, marginBottom: 20 }} />
              <span style={{ fontFamily: "'Asap', sans-serif", fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tag}</span>
              <h3 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: 19, color: C.textPrimary, letterSpacing: '-0.02em', margin: '8px 0 10px' }}>{title}</h3>
              <p style={{ fontFamily: "'Asap', sans-serif", fontSize: 15, color: C.textSecondary, lineHeight: 1.65 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dark quote band ── */}
      <section style={{ background: C.textPrimary, padding: '90px 24px', textAlign: 'center' }}>
        <div ref={refQuote} style={{ maxWidth: 740, margin: '0 auto', ...reveal(vQuote, 0) }}>
          <p style={{
            fontFamily: "'Asap', sans-serif", fontWeight: 800,
            fontSize: 'clamp(28px, 5.5vw, 54px)',
            color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.15,
          }}>
            Built by Students,<br />
            <span style={{ color: C.greenAccent }}>For Students, <br /> Communities Everywhere.</span>
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '100px 24px', maxWidth: 820, margin: '0 auto' }}>
        <h2 ref={refHow} style={{
          fontFamily: "'Asap', sans-serif", fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 42px)', color: C.textPrimary,
          letterSpacing: '-0.03em', marginBottom: 60, textAlign: 'center',
          ...reveal(vHow, 0),
        }}>How It Works</h2>
        {[
          { n: '01', title: 'Find an event',       body: 'Browse upcoming volunteer listings in your area. Search by skill, date, or cause.' },
          { n: '02', title: 'Sign up in one tap',  body: 'Reserve your spot instantly. No forms, no emails — just show up.' },
          { n: '03', title: 'Get your hours',      body: 'The organizer confirms your attendance. Hours appear on your profile automatically.' },
        ].map(({ n, title, body }, i) => (
          <div key={i} style={{
            display: 'flex', gap: 28, alignItems: 'flex-start',
            marginBottom: i < 2 ? 52 : 0,
            ...reveal(vHow, 0.12 + i * 0.16, i % 2 === 0 ? 'left' : 'right'),
          }}>
            <span style={{
              fontFamily: "'Asap', sans-serif", fontWeight: 800,
              fontSize: 52, color: C.greenMid, letterSpacing: '-0.05em',
              lineHeight: 1, flexShrink: 0, minWidth: 64,
            }}>{n}</span>
            <div style={{ paddingTop: 6 }}>
              <h3 style={{ fontFamily: "'Asap', sans-serif", fontWeight: 800, fontSize: 21, color: C.textPrimary, letterSpacing: '-0.02em', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontFamily: "'Asap', sans-serif", fontSize: 16, color: C.textSecondary, lineHeight: 1.65 }}>{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
        <div ref={refCta} style={{ ...reveal(vCta, 0) }}>
          <h2 style={{
            fontFamily: "'Asap', sans-serif", fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 58px)', color: C.textPrimary,
            letterSpacing: '-0.03em', marginBottom: 14,
          }}>Ready to make a difference?</h2>
          <p style={{ fontFamily: "'Asap', sans-serif", fontSize: 17, color: C.textSecondary, marginBottom: 36 }}>
            Join Voluntir today — it&apos;s completely free.
          </p>
          <button
            onClick={onLogin}
            style={{ padding: '16px 44px', borderRadius: 14, border: 'none', background: C.greenAccent, color: '#fff', fontFamily: "'Asap', sans-serif", fontWeight: 700, fontSize: 17, cursor: 'pointer', letterSpacing: '-0.01em' }}
            onMouseEnter={e => e.currentTarget.style.background = C.greenDark}
            onMouseLeave={e => e.currentTarget.style.background = C.greenAccent}
          >Log in with Google</button>
        </div>
      </section>

    </div>
  )
}
