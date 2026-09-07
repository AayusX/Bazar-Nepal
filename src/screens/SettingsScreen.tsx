import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, User, LogOut, ChevronRight, Info } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing, typography } from '../theme';
import ScreenHeader from '../components/ScreenHeader';

type RowProps = {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onPress?: () => void;
};

const MenuRow = ({ icon, label, sub, onPress }: RowProps) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.iconWrap}>{icon}</View>
    <View style={styles.body}>
      <Text style={styles.label}>{label}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
    <ChevronRight size={16} color={colors.textMuted} />
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }: any) {
  const { currentUser, logout } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {currentUser ? (
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('SellerProfile', {
              sellerId: currentUser.id,
              sellerName: currentUser.name,
              sellerAvatar: currentUser.avatar,
            })}
            activeOpacity={0.8}
          >
            <View style={styles.profileAvatar}>
              <User size={24} color={colors.brand} />
            </View>
            <View style={styles.profileBody}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileSub}>View your public profile</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <View style={styles.profileAvatar}>
              <User size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.profileBody}>
              <Text style={styles.profileName}>Sign in</Text>
              <Text style={styles.profileSub}>Manage your account and listings</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon={<User size={18} color={colors.brand} />}
              label="Profile"
              sub="View your public profile"
              onPress={() =>
                currentUser
                  ? navigation.navigate('SellerProfile', {
                      sellerId: currentUser.id,
                      sellerName: currentUser.name,
                      sellerAvatar: currentUser.avatar,
                    })
                  : navigation.navigate('Login')
              }
            />
            <View style={styles.divider} />
            <MenuRow icon={<Bell size={18} color={colors.brand} />} label="Notifications" sub="Alerts and activity" onPress={() => navigation.navigate('Notifications')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon={<Info size={18} color={colors.brand} />}
              label="About Bazaar Nepal"
              sub="Version 1.0.0"
              onPress={() =>
                Alert.alert(
                  'Bazaar Nepal',
                  'Version 1.0.0\n\nA peer-to-peer marketplace for Nepal.\n\nDeveloped by Mr.Aayush Bhandari\nRoot Spectra',
                )
              }
            />
          </View>
        </View>

        {currentUser ? (
          <TouchableOpacity style={styles.signOut} onPress={logout} activeOpacity={0.8}>
            <LogOut size={16} color={colors.danger} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.brandSurface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBody: { flex: 1 },
  profileName: { ...typography.title, marginBottom: 2 },
  profileSub: { ...typography.bodySmall },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.label, marginBottom: spacing.sm },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  label: { ...typography.body, fontWeight: '600' },
  sub: { ...typography.bodySmall, marginTop: 1 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 68 },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 15,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerSurface,
  },
  signOutText: { fontSize: 14, color: colors.danger, fontWeight: '700' },
});
