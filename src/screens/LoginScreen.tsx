import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Tag } from 'lucide-react-native';
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from '../api/operations';
import { useApp } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();

  const [doLogin, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data: any) => {
      await AsyncStorage.setItem('@authToken', data.login.token);
      login({
        id: data.login.user.id,
        name: data.login.user.name,
        avatar: data.login.user.avatar,
        reputation: data.login.user.reputation,
        itemsSold: data.login.user.itemsSold,
        joinDate: data.login.user.joinDate,
      });
      navigation.navigate('Main');
    },
    onError: (err) => {
      setError(err.message || 'Could not sign in. Check your details and try again.');
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setError('');
    doLogin({ variables: { input: { email, password } } });
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
          <Text style={styles.title}>Bazaar Nepal</Text>
          <Text style={styles.subtitle}>Sign in to buy and sell near you.</Text>

          <View style={styles.form}>
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
              placeholder="Enter your password"
              secureTextEntry
              textContentType="password"
              returnKeyType="go"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Sign In" onPress={handleLogin} loading={loading} style={styles.submit} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Bazaar Nepal? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.footerLink}>Create Account</Text>
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
