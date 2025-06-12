import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { validateEmail, validatePassword, getPasswordStrengthText, getPasswordStrengthColor } from '@/utils/validation';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const passwordValidation = validatePassword(password);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0]);
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
    } catch (error) {
      // Error is handled by the effect above
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Create Account
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign up to get started
          </ThemedText>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Full Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: nameError ? '#ff4444' : '#ddd' }
                ]}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: emailError ? '#ff4444' : '#ddd' }
                ]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: passwordError ? '#ff4444' : '#ddd' }
                ]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {password.length > 0 && (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthBar}>
                    <View 
                      style={[
                        styles.strengthIndicator,
                        { 
                          width: `${(passwordValidation.score / 4) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(passwordValidation.score)
                        }
                      ]}
                    />
                  </View>
                  <Text style={[
                    styles.strengthText,
                    { color: getPasswordStrengthColor(passwordValidation.score) }
                  ]}>
                    {getPasswordStrengthText(passwordValidation.score)}
                  </Text>
                </View>
              )}
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: confirmPasswordError ? '#ff4444' : '#ddd' }
                ]}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: tintColor }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <ThemedText>Already have an account? </ThemedText>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={[styles.loginLink, { color: tintColor }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 5,
  },
  passwordStrength: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthIndicator: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  registerButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLink: {
    fontWeight: '600',
  },
});