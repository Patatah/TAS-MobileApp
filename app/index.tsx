// app/index.tsx
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/UseAuth';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function LoginScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { login, loading, error, checkToken, isCheckingToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const hasToken = await checkToken();
      if (hasToken) {
        router.replace('/mis-recetas');
      }
    };
    verifyToken();
  }, []);

  const handleLogin = async () => {
    const success = await login({ email, password });
    if (success) {
      router.replace('/mis-recetas');
    }
  };

  if (isCheckingToken) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? '#e5e7eb' : '#3f3f46'} />
        <Text className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Verificando sesión...
        </Text>
      </View>
    );
  };
      const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-zinc-50 px-6 pt-14 pb-10 dark:bg-black">
        <View className="mb-10 flex-row items-center justify-between">
          <View>
            <Text className="text-[26px] font-semibold tracking-tight">
              Te Acerco Salud
            </Text>
            <Text className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Organiza tus recetas en un solo lugar
            </Text>
          </View>

          <ThemeToggle />
        </View>
        <View className="rounded-3xl bg-white/95 p-5 shadow-lg shadow-zinc-300/40 dark:bg-zinc-900/95 dark:shadow-black/60">
          <Text className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">
            Inicia sesión para ver tus recetas
          </Text>

          <View className="mb-4 gap-1.5">
            <Text className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
              Correo electrónico
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
            />
          </View>

          <View className="mb-2 gap-1.5">
            <Text className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
              Contraseña
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="••••••••"
              placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
            />
          </View>

          {error && (
            <Text className="mb-2 text-xs text-red-500">
              {error}
            </Text>
          )}

          <Button className="mt-3 w-full rounded-2xl" onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={isDark ? '#18181B' : '#FFFFFF'} />
            ) : (
              <Text
                className={
                  'text-sm font-medium ' +
                  (isDark ? 'text-zinc-900' : 'text-white')
                }
              >
                Iniciar sesión
              </Text>
            )}
          </Button>

          <Text className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
            Tus datos se usan solo para gestionar tus recetas en TAS.
          </Text>
        </View>
      
      </View>
    </View>
  );
}
