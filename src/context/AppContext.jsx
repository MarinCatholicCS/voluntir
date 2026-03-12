import { createContext, useContext, useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import {
  fbSignIn, fbSignInWithCredential, fbSignOut, fbGetProfile, fbSetProfile,
  fbGetListings, fbGetLeaderboard, fbSignUp, fbUnsign,
  fbAddListing, fbDeleteListing, fbConfirmHours, fbUnconfirmHours,
} from '../firebase/api'
import { parseHours } from '../utils'

const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({ name: "", age: "", location: "", hoursServed: 0, profilePic: "", school: "", skills: [] })
  const [listings, setListings] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteTgt, setDeleteTgt] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [viewProfileUid, setViewProfileUid] = useState(null)

  const toast_ = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const loadL = async () => { const l = await fbGetListings(); setListings(l) }
  const loadLb = async () => { try { const lb = await fbGetLeaderboard(); setLeaderboard(lb) } catch (e) { console.error(e) } }
  const refresh = async () => { setRefreshing(true); try { await Promise.all([loadL(), loadLb()]) } catch (e) { console.error(e) } setRefreshing(false) }
  const requireLogin = () => { setShowLoginModal(true) }

  const doLogin = async () => {
    if (Platform.OS !== 'web') return
    setLoginLoading(true); setLoginError(null)
    try { await fbSignIn(); setShowLoginModal(false) }
    catch (e) { setLoginError(e.message || "Sign-in failed.") }
    setLoginLoading(false)
  }

  const doLoginWithCredential = async (idToken) => {
    setLoginLoading(true); setLoginError(null)
    try { await fbSignInWithCredential(idToken); setShowLoginModal(false) }
    catch (e) { setLoginError(e.message || "Sign-in failed.") }
    setLoginLoading(false)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        setUser({ uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL })
        const p = await fbGetProfile(u.uid)
        if (p) {
          if (!p.email || p.email !== u.email) { await fbSetProfile(u.uid, { email: u.email }); p.email = u.email }
          setProfile(p)
        } else {
          const np = { name: u.displayName || "", age: "", location: "", hoursServed: 0, profilePic: "", email: u.email || "", school: "", skills: [] }
          await fbSetProfile(u.uid, np)
          setProfile(np)
        }
      } else {
        setUser(null)
      }
      try { await Promise.all([loadL(), loadLb()]) } catch (e) { console.error(e) }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logout = async () => {
    try { await fbSignOut() } catch (e) { console.error(e) }
    setUser(null)
    setProfile({ name: "", age: "", location: "", hoursServed: 0, profilePic: "", school: "", skills: [] })
  }

  const signUp = async (id) => {
    if (!user) { requireLogin(); return }
    const l = listings.find(x => x.id === id); if (!l) return
    setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: x.currentVolunteers + 1, volunteers: [...(x.volunteers || []), user.uid] } : x))
    toast_(`Signed up for ${l.title}!`)
    try { await fbSignUp(id, user.uid) }
    catch (e) {
      console.error(e)
      setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: x.currentVolunteers - 1, volunteers: (x.volunteers || []).filter(v => v !== user.uid) } : x))
      toast_("Error signing up.")
    }
  }

  const unsign = async (id) => {
    if (!user) return
    const l = listings.find(x => x.id === id); if (!l) return
    setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: Math.max(0, x.currentVolunteers - 1), volunteers: (x.volunteers || []).filter(v => v !== user.uid) } : x))
    toast_(`Cancelled registration for ${l.title}`)
    try { await fbUnsign(id, user.uid) }
    catch (e) {
      console.error(e)
      setListings(p => p.map(x => x.id === id ? { ...x, currentVolunteers: x.currentVolunteers + 1, volunteers: [...(x.volunteers || []), user.uid] } : x))
      toast_("Error cancelling.")
    }
  }

  const confirmVolunteerHours = async (lid, uid) => {
    const l = listings.find(x => x.id === lid); if (!l) return
    const h = parseHours(l.time)
    setListings(p => p.map(x => x.id === lid ? { ...x, confirmedVolunteers: [...(x.confirmedVolunteers || []), uid] } : x))
    toast_(`Confirmed ${h} hr${h !== 1 ? "s" : ""} for volunteer`)
    try {
      await fbConfirmHours(lid, uid, h)
      await loadLb()
      if (user && uid === user.uid) { const p = await fbGetProfile(user.uid); if (p) setProfile(p) }
    } catch (e) {
      console.error(e)
      setListings(p => p.map(x => x.id === lid ? { ...x, confirmedVolunteers: (x.confirmedVolunteers || []).filter(v => v !== uid) } : x))
      toast_("Error confirming hours.")
    }
  }

  const unconfirmVolunteerHours = async (lid, uid) => {
    const l = listings.find(x => x.id === lid); if (!l) return
    const h = parseHours(l.time)
    setListings(p => p.map(x => x.id === lid ? { ...x, confirmedVolunteers: (x.confirmedVolunteers || []).filter(v => v !== uid) } : x))
    toast_(`Revoked ${h} hr${h !== 1 ? "s" : ""} from volunteer`)
    try {
      await fbUnconfirmHours(lid, uid, h)
      await loadLb()
      if (user && uid === user.uid) { const p = await fbGetProfile(user.uid); if (p) setProfile(p) }
    } catch (e) {
      console.error(e)
      setListings(p => p.map(x => x.id === lid ? { ...x, confirmedVolunteers: [...(x.confirmedVolunteers || []), uid] } : x))
      toast_("Error revoking hours.")
    }
  }

  const confirmDelete = async () => {
    if (!deleteTgt) return
    const { id, title } = deleteTgt
    const listing = listings.find(l => l.id === id)
    const confirmedVols = listing?.confirmedVolunteers || []
    const hours = listing ? parseHours(listing.time) : 0
    setDeleteTgt(null)
    setListings(p => p.filter(l => l.id !== id))
    toast_(`"${title}" deleted.`)
    try {
      await fbDeleteListing(id, confirmedVols, hours)
      await Promise.all([loadL(), loadLb()])
      if (user && confirmedVols.includes(user.uid)) { const p = await fbGetProfile(user.uid); if (p) setProfile(p) }
    } catch (e) { console.error(e); toast_("Error deleting."); await loadL() }
  }

  const createListing = async (data) => {
    try {
      const newId = await fbAddListing(data)
      setListings(p => [...p, { ...data, id: newId }].sort((a, b) => a.date.localeCompare(b.date)))
    } catch (e) { console.error(e) }
  }

  const handleViewProfile = (uid) => {
    if (user && uid === user.uid) return 'self'
    setViewProfileUid(uid)
    return 'other'
  }

  const value = {
    user, profile, setProfile, listings, leaderboard,
    toast, loading, refreshing, deleteTgt, setDeleteTgt,
    showLoginModal, setShowLoginModal, loginLoading, loginError,
    viewProfileUid, setViewProfileUid,
    toast_, refresh, requireLogin, doLogin, doLoginWithCredential, logout,
    signUp, unsign, confirmVolunteerHours, unconfirmVolunteerHours,
    confirmDelete, createListing, handleViewProfile,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
