import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppDispatch, RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { clearCart } from '@/store/slices/cartSlice';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  const { orders } = useSelector((state: RootState) => state.orders);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            dispatch(clearCart());
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'account-circle',
      title: 'Account Information',
      subtitle: 'Manage your personal details',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
    },
    {
      icon: 'credit-card',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
    },
    {
      icon: 'location-on',
      title: 'Addresses',
      subtitle: 'Manage your delivery addresses',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
    },
    {
      icon: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with your orders and account',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
    },
    {
      icon: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon'),
    },
  ];

  const renderMenuItem = (item: typeof menuItems[0], index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.menuItem}
        onPress={item.onPress}
      >
        <View style={[styles.menuIcon, { backgroundColor: `${tintColor}20` }]}>
          <MaterialIcons name={item?.icon} size={24} color={tintColor} />
        </View>
        <View style={styles.menuContent}>
          <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.menuSubtitle}>
            {item.subtitle}
          </ThemedText>
        </View>
        <IconSymbol name="chevron.right" size={16} color="#999" />
      </TouchableOpacity>
    )
  }



  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: tintColor }]}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.userName}>
            {user?.name || 'User'}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </ThemedText>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={[styles.statNumber, { color: tintColor }]}>
              {orders.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Orders</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={[styles.statNumber, { color: tintColor }]}>
              {totalItems}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Cart Items</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={[styles.statNumber, { color: tintColor }]}>
              ${totalAmount.toFixed(0)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Cart Value</ThemedText>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <IconSymbol name="arrow.right.square" size={24} color="#ff4444" />
          <ThemedText style={styles.logoutText}>
            Logout
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={styles.appVersion}>
            Quick Cart v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    marginBottom: 5,
  },
  userEmail: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  appVersion: {
    fontSize: 12,
    opacity: 0.5,
  },
});