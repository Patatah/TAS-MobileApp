import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useRecetas } from '@/hooks/useRecetas';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Te Acerco Salud',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const {recipes, loading, error} = useRecetas();
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
      <Text>{recipes}</Text>
      <Text>{loading}</Text>
      <Text>{error}</Text>
      </View>
    </>
  );
}