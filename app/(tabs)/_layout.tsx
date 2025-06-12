import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

import { AuthGuard } from '@/components/AuthGuard';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RootState } from '@/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { totalItems } = useSelector((state: RootState) => state.cart);

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Products',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
            tabBarBadge: totalItems > 0 ? totalItems : undefined,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
