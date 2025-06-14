import { Stack } from 'expo-router';

export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: true,
          headerTitle: 'Product Details',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );
}