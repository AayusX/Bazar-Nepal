import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User as UserIcon, Phone, Tag } from 'lucide-react-native';
import { useMutation } from '@apollo/client/react';
import { REGISTER_MUTATION } from '../api/operations';
import { useApp } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import Input from '../components/Input';
import Button from '../components/Button';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();

  const [doRegister, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: async (data: any) => {
      await AsyncStorage.setItem('@authToken', data.register.token);
      login({
        id: data.register.user.id,
        name: data.register.user.name,
        avatar: data.register.user.avatar,
        reputation: data.register.user.reputation,
        itemsSold: data.register.user.itemsSold,
        joinDate: data.register.user.joinDate,
      });
      navigation.navigate('Main');
    },
    onError: (err) => {
      setError(err.message || 'Could not create your account. Try again.');
    },
  });

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError('Fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    doRegister({
      variables: {
        input: { name, email, password, phone: phone || undefined },
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandMark}>
            <Tag size={26} color={colors.brand} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Bazaar Nepal to start buying and selling.</Text>

          <View style={styles.form}>
            <Input
              label="Full Name"
              icon={<UserIcon size={18} color={colors.textMuted} />}
              placeholder="Aayush Bhandari"
              textContentType="name"
              returnKeyType="next"
              value={name}
              onChangeText={setName}
            />
            <Input
              label="Email"
              icon={<Mail size={18} color={colors.textMuted} />}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Password"
              icon={<Lock size={18} color={colors.textMuted} />}
              placeholder="At least 6 characters"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
              value={password}
              onChangeText={setPassword}
            />
            <Input
              label="Phone (Optional)"
              icon={<Phone size={18} color={colors.textMuted} />}
              placeholder="9812345678"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              returnKeyType="done"
              value={phone}
              onChangeText={setPhone}
              onSubmitEditing={handleRegister}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Create Account" onPress={handleRegister} loading={loading} style={styles.submit} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandSurface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.headerTitle, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.bodySmall, textAlign: 'center', marginBottom: spacing.xxl },
  form: { marginBottom: spacing.xxl },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
  submit: { marginTop: spacing.sm },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  footerText: { ...typography.bodySmall },
  footerLink: { ...typography.buttonSmall, marginLeft: 2 },
});
