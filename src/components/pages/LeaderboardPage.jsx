import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { C } from '../../constants';
import { I } from '../Icons';
import { Avatar } from '../Common';
import { useApp } from '../../context/AppContext';

export default function LeaderboardPage() {
  const { user, leaderboard, handleViewProfile } = useApp();
  const [tab, setTab] = useState('volunteers');
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const schoolData = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) return [];
    const map = {};
    leaderboard.forEach((entry) => {
      const school = entry.school || 'Unknown';
      if (!map[school]) map[school] = { school, members: 0, hours: 0 };
      map[school].members += 1;
      map[school].hours += entry.hoursServed || 0;
    });
    return Object.values(map).sort((a, b) => b.hours - a.hours);
  }, [leaderboard]);

  const top3 = (leaderboard || []).slice(0, 3);
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  const podiumHeights = [100, 140, 80];
  const podiumLabels = ['2nd', '1st', '3rd'];
  const podiumColors = [C.greenMid, C.greenAccent, C.greenLight];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.heading}>Leaderboard</Text>

      {/* Tabs */}
      <View style={s.tabRow}>
        {['volunteers', 'schools'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.tab, tab === t && s.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t === 'volunteers' ? 'Volunteers' : 'Schools'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'volunteers' ? (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <View style={s.podiumContainer}>
              {podiumOrder.map((entry, idx) => {
                if (!entry) return null;
                const actualRank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                return (
                  <TouchableOpacity
                    key={entry.uid || idx}
                    style={s.podiumItem}
                    onPress={() => handleViewProfile && handleViewProfile(entry.uid)}
                  >
                    <Avatar
                      uri={entry.photoURL}
                      name={entry.name}
                      size={idx === 1 ? 72 : 56}
                    />
                    <Text style={s.podiumName} numberOfLines={1}>
                      {entry.name || 'Anonymous'}
                    </Text>
                    {entry.school ? (
                      <Text style={s.podiumSchool} numberOfLines={1}>
                        {entry.school}
                      </Text>
                    ) : null}
                    <Text style={s.podiumHours}>{entry.hoursServed || 0}h</Text>
                    <View
                      style={[
                        s.podiumBar,
                        {
                          height: podiumHeights[idx],
                          backgroundColor: podiumColors[idx],
                        },
                      ]}
                    >
                      <Text style={s.podiumRank}>{podiumLabels[idx]}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Full rankings table */}
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.headerCell, s.rankCol]}>#</Text>
              <Text style={[s.headerCell, s.nameCol]}>Name</Text>
              {!isMobile && (
                <Text style={[s.headerCell, s.schoolCol]}>School</Text>
              )}
              <Text style={[s.headerCell, s.hoursCol]}>Hours</Text>
            </View>
            {(leaderboard || []).map((entry, idx) => {
              const isCurrentUser = user && entry.uid === user.uid;
              return (
                <TouchableOpacity
                  key={entry.uid || idx}
                  style={[
                    s.tableRow,
                    isCurrentUser && s.tableRowHighlight,
                    idx % 2 === 0 && s.tableRowEven,
                  ]}
                  onPress={() =>
                    handleViewProfile && handleViewProfile(entry.uid)
                  }
                >
                  <Text style={[s.cell, s.rankCol, s.rankText]}>
                    {idx + 1}
                  </Text>
                  <View style={[s.nameCol, s.nameCell]}>
                    <Avatar
                      uri={entry.photoURL}
                      name={entry.name}
                      size={32}
                    />
                    <Text style={s.nameText} numberOfLines={1}>
                      {entry.name || 'Anonymous'}
                    </Text>
                  </View>
                  {!isMobile && (
                    <Text
                      style={[s.cell, s.schoolCol]}
                      numberOfLines={1}
                    >
                      {entry.school || '—'}
                    </Text>
                  )}
                  <Text style={[s.cell, s.hoursCol, s.hoursText]}>
                    {entry.hoursServed || 0}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : (
        /* Schools tab */
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.headerCell, s.rankCol]}>#</Text>
            <Text style={[s.headerCell, s.schoolNameCol]}>School</Text>
            <Text style={[s.headerCell, s.membersCol]}>Members</Text>
            <Text style={[s.headerCell, s.hoursCol]}>Hours</Text>
          </View>
          {schoolData.map((school, idx) => (
            <View
              key={school.school}
              style={[s.tableRow, idx % 2 === 0 && s.tableRowEven]}
            >
              <Text style={[s.cell, s.rankCol, s.rankText]}>{idx + 1}</Text>
              <Text style={[s.cell, s.schoolNameCol]} numberOfLines={1}>
                {school.school}
              </Text>
              <Text style={[s.cell, s.membersCol]}>{school.members}</Text>
              <Text style={[s.cell, s.hoursCol, s.hoursText]}>
                {school.hours}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.offWhite,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 16,
    fontFamily: 'Asap',
  },

  /* Tabs */
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: C.cream,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: C.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.textMuted,
    fontFamily: 'Asap',
  },
  tabTextActive: {
    color: C.greenDark,
  },

  /* Podium */
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 120,
    marginHorizontal: 6,
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Asap',
  },
  podiumSchool: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    fontFamily: 'Asap',
  },
  podiumHours: {
    fontSize: 16,
    fontWeight: '700',
    color: C.greenDark,
    marginTop: 2,
    fontFamily: 'Asap',
  },
  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumRank: {
    fontSize: 16,
    fontWeight: '700',
    color: C.white,
    fontFamily: 'Asap',
  },

  /* Table */
  table: {
    backgroundColor: C.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: C.cream,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Asap',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  tableRowEven: {
    backgroundColor: C.offWhite,
  },
  tableRowHighlight: {
    backgroundColor: C.greenLight,
  },
  cell: {
    fontSize: 14,
    color: C.textPrimary,
    fontFamily: 'Asap',
  },
  rankCol: {
    width: 36,
  },
  rankText: {
    fontWeight: '700',
    color: C.textSecondary,
  },
  nameCol: {
    flex: 1,
  },
  nameCell: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.textPrimary,
    flexShrink: 1,
    fontFamily: 'Asap',
  },
  schoolCol: {
    width: 120,
  },
  schoolNameCol: {
    flex: 1,
  },
  membersCol: {
    width: 80,
    textAlign: 'center',
  },
  hoursCol: {
    width: 60,
    textAlign: 'right',
  },
  hoursText: {
    fontWeight: '700',
    color: C.greenDark,
  },
});
