import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { C } from '../../constants';
import { I } from '../Icons';

const FEATURES = [
  {
    icon: 'Calendar',
    title: 'Discover Events',
    desc: 'Find volunteer opportunities in your community that match your skills and interests.',
  },
  {
    icon: 'Clock',
    title: 'Track Hours',
    desc: 'Log your volunteer hours automatically and build a verified service record.',
  },
  {
    icon: 'Users',
    title: 'Connect with Community',
    desc: 'Meet like-minded volunteers and make a real difference together.',
  },
];

const STEPS = [
  { num: '1', title: 'Sign Up', desc: 'Create your profile in seconds with Google sign-in.' },
  { num: '2', title: 'Browse', desc: 'Explore events near you filtered by date, skills, or location.' },
  { num: '3', title: 'Volunteer', desc: 'Sign up, show up, and start making an impact.' },
];

function FeatureCard({ icon, title, desc }) {
  const Icon = I[icon];
  return (
    <View style={s.featureCard}>
      <View style={s.featureIconWrap}>
        {Icon ? <Icon size={28} color={C.greenAccent} /> : null}
      </View>
      <Text style={s.featureTitle}>{title}</Text>
      <Text style={s.featureDesc}>{desc}</Text>
    </View>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <View style={s.stepCard}>
      <View style={s.stepCircle}>
        <Text style={s.stepNum}>{num}</Text>
      </View>
      <Text style={s.stepTitle}>{title}</Text>
      <Text style={s.stepDesc}>{desc}</Text>
    </View>
  );
}

export default function LandingPage({ onLogin, onBrowse }) {
  if (Platform.OS !== 'web') return null;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerInner}>
          <View style={s.logoRow}>
            <Image source={require('../../../assets/voluntir.png')} style={s.logo} resizeMode="contain" />
            <Text style={s.logoText}>Voluntir</Text>
          </View>
          <TouchableOpacity style={s.signInBtn} onPress={onLogin}>
            <Text style={s.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Hero ── */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>Connect with your community</Text>
        <Text style={s.heroDesc}>
          Voluntir makes it easy to discover volunteer opportunities, track your service hours, and
          build a community of people who care.
        </Text>
        <View style={s.heroBtns}>
          <TouchableOpacity style={s.primaryBtn} onPress={onLogin}>
            <Text style={s.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryBtn} onPress={onBrowse}>
            <Text style={s.secondaryBtnText}>Browse Events</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Features ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Why Voluntir?</Text>
        <View style={s.featuresRow}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </View>
      </View>

      {/* ── How It Works ── */}
      <View style={[s.section, { backgroundColor: C.cream }]}>
        <Text style={s.sectionTitle}>How It Works</Text>
        <View style={s.stepsRow}>
          {STEPS.map((st) => (
            <StepCard key={st.num} num={st.num} title={st.title} desc={st.desc} />
          ))}
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={s.footer}>
        <Text style={s.footerText}>
          {'\u00A9'} {new Date().getFullYear()} Voluntir. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.white,
  },
  content: {
    flexGrow: 1,
  },

  /* Header */
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: C.greenDark,
    fontFamily: 'Asap',
    marginLeft: 10,
  },
  signInBtn: {
    backgroundColor: C.greenAccent,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
  },
  signInBtnText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 15,
    fontFamily: 'Asap',
  },

  /* Hero */
  hero: {
    alignItems: 'center',
    paddingVertical: 72,
    paddingHorizontal: 24,
    backgroundColor: C.offWhite,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: C.textPrimary,
    fontFamily: 'Asap',
    textAlign: 'center',
    maxWidth: 600,
  },
  heroDesc: {
    fontSize: 18,
    color: C.textSecondary,
    fontFamily: 'Asap',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 520,
    lineHeight: 28,
  },
  heroBtns: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 32,
  },
  primaryBtn: {
    backgroundColor: C.greenAccent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Asap',
  },
  secondaryBtn: {
    backgroundColor: C.white,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.greenAccent,
  },
  secondaryBtnText: {
    color: C.greenAccent,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Asap',
  },

  /* Section */
  section: {
    paddingVertical: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: C.textPrimary,
    fontFamily: 'Asap',
    marginBottom: 32,
    textAlign: 'center',
  },

  /* Features */
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 1000,
  },
  featureCard: {
    backgroundColor: C.offWhite,
    borderRadius: 16,
    padding: 28,
    width: 300,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  featureIconWrap: {
    backgroundColor: C.greenLight,
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
    fontFamily: 'Asap',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: C.textSecondary,
    fontFamily: 'Asap',
    lineHeight: 22,
  },

  /* Steps */
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    maxWidth: 900,
  },
  stepCard: {
    alignItems: 'center',
    width: 240,
    paddingVertical: 12,
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.greenAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  stepNum: {
    color: C.white,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Asap',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.textPrimary,
    fontFamily: 'Asap',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    color: C.textSecondary,
    fontFamily: 'Asap',
    textAlign: 'center',
    lineHeight: 22,
  },

  /* Footer */
  footer: {
    backgroundColor: C.textPrimary,
    paddingVertical: 28,
    alignItems: 'center',
  },
  footerText: {
    color: C.textMuted,
    fontSize: 14,
    fontFamily: 'Asap',
  },
});
